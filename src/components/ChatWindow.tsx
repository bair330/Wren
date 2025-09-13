'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  id: number
  text: string
  sender: 'user' | 'wren'
  timestamp: string
}

interface ChatWindowProps {
  initialMessages?: Message[]
}

export default function ChatWindow({ initialMessages = [] }: ChatWindowProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: "Welcome to your meditation journey. I'm Wren, your personal meditation assistant. How are you feeling today?",
      sender: 'wren',
      timestamp: new Date().toLocaleTimeString()
    },
    ...initialMessages
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [sessionStartTime] = useState(new Date())

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      
      // Simulate Wren's response
      setTimeout(() => {
        const responses = [
          "I understand. Let's take a moment to breathe together. Would you like to start with a 5-minute breathing exercise?",
          "That's completely normal. Sometimes we all need a moment to pause and reconnect with ourselves.",
          "I'm here to help you find peace. What kind of meditation would you like to explore today?",
          "Let's work together to bring you to a calmer state. Would you like to try some mindful breathing?"
        ]
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        const wrenResponse: Message = {
          id: Date.now() + Math.random(),
          text: randomResponse,
          sender: 'wren',
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, wrenResponse])
      }, 1000)
    }
  }



  const completeSession = () => {
    const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60))
    const params = new URLSearchParams({
      duration: Math.max(sessionDuration, 1).toString(),
      sessionType: 'Guided Chat Session'
    })
    
    router.push(`/session-summary?${params.toString()}`)
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b" style={{ borderColor: 'var(--subtle)' }}>
        <h1 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text)' }}>Meditation Session</h1>
        <p className="mt-1 text-sm md:text-base" style={{ color: 'var(--subtle)' }}>Let Wren guide you to inner peace</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-lg touch-manipulation"
              style={{
                backgroundColor: message.sender === 'user' ? 'var(--accent)' : 'var(--panel)',
                color: 'var(--text)'
              }}
            >
              <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>



      {/* Input Area */}
      <div className="flex-shrink-0 p-3 md:p-6 border-t" style={{ borderColor: 'var(--subtle)', backgroundColor: 'var(--bg)' }}>
        {/* Mobile-optimized input layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 md:mb-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share how you're feeling..."
            className="flex-1 px-3 md:px-4 py-3 md:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-base touch-manipulation"
            style={{
              backgroundColor: 'var(--panel)',
              borderColor: 'var(--subtle)',
              color: 'var(--text)',
              '--tw-ring-color': 'var(--accent)'
            } as React.CSSProperties}
          />
          <div className="flex gap-2 sm:gap-0">
            <button
              onClick={sendMessage}
              className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-2 rounded-lg transition-colors touch-manipulation min-h-[44px] font-medium"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--text)'
              }}
            >
              Send
            </button>
          </div>
        </div>
        
        {/* Complete Session Button */}
        <div className="flex justify-center">
          <button
            onClick={completeSession}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3 font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg touch-manipulation min-h-[44px]"
            style={{
              background: 'linear-gradient(to right, var(--accent), var(--accent-2))',
              color: 'var(--text)'
            }}
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  )
}