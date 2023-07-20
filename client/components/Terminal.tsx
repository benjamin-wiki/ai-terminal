import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react'
import Typing from './extras/Typing'
import { callAI } from './extras/AI'
import { handleProjectCommand } from './extras/Projects'
import './extras/styles.css'

// the active form
const TerminalPrompt = () => (
  <>
    <span className="prompt">
      <span className="cashLine">╭─</span>
      <span className="benjamins">benjamins@terminal</span>{' '}
      <span className="dir">~/portfolio</span>
    </span>
    <br />
    <span className="prompt">
      <span className="cashLine">╰─$</span>{' '}
    </span>
  </>
)

// this component is a form that looks like a terminal. It has a prompt and a place where you can type commands.
// When you type, it updates the command. When you press Enter, it submits the command.
interface TerminalFormProps {
  input: string
  handleInput: (event: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  inputRef: React.RefObject<HTMLInputElement>
}
const TerminalForm = ({
  input,
  handleInput,
  handleSubmit,
  inputRef,
}: TerminalFormProps) => (
  <form onSubmit={handleSubmit} title="terminalInput">
    <div>
      <TerminalPrompt />
      <input
        type="text"
        value={input}
        onChange={handleInput}
        className="terminal-input"
        ref={inputRef}
        title="terminalInput"
      />
    </div>
  </form>
)

interface TerminalMessageProps {
  message: string | JSX.Element | undefined
  sender: string
  onTypingComplete: () => void
  userInput?: string
  mode: string
}

const TerminalMessage = ({
  message, // message to display
  sender, // who sent the message (user/system or AI)
  onTypingComplete, // animated typing function
  userInput, // the command the user has given
  mode, // indicates the mode of the terminal
}: TerminalMessageProps) => {
  const [isTypingComplete, setIsTypingComplete] = useState(false) // initial variable to false
  // set state to true after message completed
  const handleTypingComplete = () => {
    setIsTypingComplete(true)
    onTypingComplete()
  }

  return (
    <div className={`message ${sender}`}>
      {sender === 'user' ? (
        <>
          {/* <span className="prompt">╭─benjamins@terminal ~/portfolio</span>
          <br />
          <span className="prompt">╰─$ command:{userInput}</span>
          <br /> */}
        </>
      ) : (
        <>
          <span className="prompt">
            <span className="cashLine">╭─</span>
            <span className="benjamins">benjamins@terminal</span>{' '}
            <span className="dir">~/portfolio</span>
          </span>
          <br />
          <span className="prompt">
            ╰─$ {userInput} <br />
          </span>
          {/* activate typing function if terminal is in AI mode */}
          {mode === 'ai' ? (
            <Typing message={message} onTypingComplete={handleTypingComplete} />
          ) : (
            message
          )}
        </>
      )}
    </div>
  )
}

const Terminal = () => {
  const [mode, setMode] = useState<string>('user')
  const [input, setInput] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [inputKey, setInputKey] = useState<number>(0)
  const [chatLog, setChatLog] = useState<
    {
      message: string | JSX.Element | undefined
      sender: string
      userInput?: string
    }[]
  >([])

  const inputRef = useRef<HTMLInputElement>(null)

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const commands = ['help', 'about', 'projects', 'user', 'ai', 'mode', 'clear']

  const handleCommand = async (command: string) => {
    let projectDetails: string | JSX.Element | undefined

    switch (command) {
      case 'ai':
        if (mode !== 'ai') {
          setMode('ai')
          setChatLog((prevChatLog) => [
            ...prevChatLog,
            {
              message: 'Switched to AI mode',
              sender: 'system',
              userInput: command,
            },
          ])
        }
        break
      case 'user':
        setMode('user')
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          {
            message: 'Switched to user mode',
            sender: 'system',
            userInput: command,
          },
        ])
        break
      case 'help':
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          {
            message: 'Available commands: ' + commands.join(', '),
            sender: 'system',
            userInput: command,
          },
        ])
        break
      case 'about':
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          {
            message:
              'Currently working at a startup in the Bedroom Area, I am a full sleep engineer with a focus on dreaming.',
            sender: 'system',
            userInput: command,
          },
        ])
        break
      case 'projects':
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          {
            message:
              'Here are some of my projects: Project 1, Project 2, Project 3',
            sender: 'system',
            userInput: command,
          },
        ])
        break
      case 'project 1':
      case 'project 2':
      case 'project 3':
      case 'project 4':
        projectDetails = handleProjectCommand(command.split(' ')[1])
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          {
            message: projectDetails!,
            sender: 'system',
            userInput: command,
          },
        ])
        break
      case 'mode':
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          {
            message: 'You are in ' + mode + ' mode.',
            sender: 'system',
            userInput: command,
          },
        ])
        break
      case 'clear':
        setChatLog([])
        break
      default:
        if (mode === 'ai') {
          const aiResponse = await callAI(input)
          setChatLog((prevChatLog) => [
            ...prevChatLog,
            { message: aiResponse, sender: 'AI', userInput: command },
          ])
        } else {
          setChatLog((prevChatLog) => [
            ...prevChatLog,
            {
              message: `unrecognized command: ${command}`,
              sender: 'system',
              userInput: command,
            },
          ])
        }
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsProcessing(true)
    setInputKey((prevKey) => prevKey + 1)
    handleCommand(input)
    setInput('')
  }

  // focus text cursor to form
  const handleTypingComplete = () => {
    // trying to wait for message to complete then refocus
    setIsProcessing(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }, [inputKey])

  return (
    <div>
      <div className="terminal">
        {chatLog.map((chat, index) => (
          <TerminalMessage
            key={index}
            mode={mode}
            message={chat.message}
            sender={chat.sender}
            onTypingComplete={handleTypingComplete}
            userInput={chat.userInput}
          />
        ))}
        <TerminalForm
          input={input}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
        />
      </div>
    </div>
  )
}

export default Terminal
