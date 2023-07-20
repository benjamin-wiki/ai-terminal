import './App.css'
import './components/extras/styles.css'
import React, { useState, useEffect } from 'react'
import Terminal from './components/Terminal'
import { PulseLoader } from 'react-spinners'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000) // 3000ms delay

    return () => clearTimeout(timer) // Clean up on component unmount
  }, [])

  if (isLoading) {
    return (
      <div className="loader">
        <PulseLoader color={'#0f0'} loading={true} size={30} />
      </div>
    )
  }

  return <Terminal />
}

export default App
