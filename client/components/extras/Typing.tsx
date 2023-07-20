import React, { useEffect, useState } from 'react'

const Typing = ({ message, onTypingComplete }) => {
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [index, setIndex] = useState(0) // Add this line

  useEffect(() => {
    let timer
    if (index < message.length) {
      timer = setTimeout(() => {
        setDisplayedMessage((prevTyping) => prevTyping + message[index])
        setIndex((prevIndex) => prevIndex + 1)
      }, 10) // Adjust speed here
    } else {
      onTypingComplete() // Call the function passed from parent when typing is done
    }
    return () => clearTimeout(timer)
  }, [index, message, onTypingComplete])

  return <span>{displayedMessage}</span>
}

export default Typing
