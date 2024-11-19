import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react'
import backgroundImage from './assets/Background.jpg'

function App() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [charAllowed, setCharAllowed] = useState(true)
  const [numAllowed, setNumAllowed] = useState(true)
  const [copied, setCopied] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('Weak')

  const passwordRef = useRef(null)

  const calculatePasswordStrength = useCallback((pass) => {
    let strength = 0;
    
    // Length checks
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (pass.length >= 16) strength++;

    // Character type checks
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecialChars = /[!@#$%^&*()_+~|}{[\]:;?><,./-=]/.test(pass);

    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers && numAllowed) strength++;
    if (hasSpecialChars && charAllowed) strength++;

    // Determine strength based on total score
    switch (true) {
      case (strength <= 2):
        return 'Weak';
      case (strength <= 4):
        return 'Medium';
      case (strength <= 6):
        return 'Strong';
      default:
        return 'Very Strong';
    }
  }, [numAllowed, charAllowed])

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const specialChars = "!@#$%^&*()_+~|}{[]:;?><,./-=";
    const numbers = "0123456789";

    // Always include at least one uppercase and one lowercase letter
    pass += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
    pass += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));

    // If special characters are allowed, add at least one
    if (charAllowed) {
      pass += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
      str += specialChars;
    }

    // If numbers are allowed, add at least one
    if (numAllowed) {
      pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
      str += numbers;
    }

    // Fill the rest of the password
    while (pass.length < length) {
      pass += str.charAt(Math.floor(Math.random() * str.length));
    }

    // Shuffle the password to make it more random
    pass = pass.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(pass);
    setPasswordStrength(calculatePasswordStrength(pass));
  }, [length, charAllowed, numAllowed, calculatePasswordStrength])

  const copyToClipboard = useCallback(() => {
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, charAllowed, numAllowed, passwordGenerator])

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 'Weak': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Strong': return 'text-green-500';
      case 'Very Strong': return 'text-green-800';
      default: return 'text-gray-500';
    }
  }

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center opacity-50 -z-10" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className='min-h-screen bg-transparent flex items-center justify-center p-4'>
        <div className='w-full max-w-md bg-white/90 rounded-xl shadow-2xl border border-gray-200 p-8 backdrop-blur-sm'>
          <div className='flex items-center justify-center mb-8'>
            <ShieldCheck className='text-blue-600 mr-3' size={36} />
            <h1 className='text-3xl font-semibold text-gray-800'>Secure Password</h1>
          </div>

          <div className='relative mb-6'>
            <input
              type="text"
              value={password}
              className='w-full py-3 px-4 pr-12 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Generated Password'
              ref={passwordRef}
              readOnly
            />
            <button
              onClick={copyToClipboard}
              className='absolute top-1/2 right-3 transform -translate-y-1/2'
              aria-label="Copy Password"
            >
              {copied ? (
                <span className='text-green-600 font-medium'>Copied</span>
              ) : (
                <Copy className='text-gray-600 hover:text-blue-600 transition-colors' />
              )}
            </button>
          </div>

          <div className='mb-4 flex justify-between items-center'>
            <span className='text-gray-700 font-medium'>Password Strength:</span>
            <span className={`font-semibold ${getStrengthColor()}`}>
              {passwordStrength}
            </span>
          </div>

          <div className='space-y-6'>
            <div className=''>
              <div className='flex justify-between items-center mb-2'>
                <label className='text-gray-700 font-medium'>Password Length</label>
                <span className='text-gray-600 font-mono'>{length}</span>
              </div>
              <input
                type="range"
                min={6}
                max={32}
                value={length}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>

            <div className='flex justify-between'>
              <label className='flex items-center text-gray-700'>
                <input
                  type="checkbox"
                  checked={charAllowed}
                  onChange={() => setCharAllowed(prev => !prev)}
                  className='mr-2 text-blue-600 focus:ring-blue-500 h-4 w-4 text-opacity-50 border-gray-300 rounded'
                />
                Special Characters
              </label>

              <label className='flex items-center text-gray-700'>
                <input
                  type="checkbox"
                  checked={numAllowed}
                  onChange={() => setNumAllowed(prev => !prev)}
                  className='mr-2 text-blue-600 focus:ring-blue-500 h-4 w-4 text-opacity-50 border-gray-300 rounded'
                />
                Numbers
              </label>
            </div>

            <button
              onClick={passwordGenerator}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            >
              <RefreshCw className='mr-2' />
              Generate New Password
            </button>
          </div>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-500'>
              Strong passwords protect your digital identity
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App