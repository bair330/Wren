'use client'

import { useState } from 'react'

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to your meditation journey. I'm Wren, your personal meditation assistant. How are you feeling today?",
      sender: 'wren',
      timestamp: new Date().toLocaleTimeString()
    },
    ...initialMessages
  ])
  const [inputMessage, setInputMessage] = useState('')

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
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
          "Let's focus on the present moment. Can you tell me three things you can see around you right now?",
          "Breathing is the foundation of mindfulness. Let's practice together - inhale for 4 counts, hold for 4, exhale for 6."
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        const wrenResponse: Message = {
          id: messages.length + 2,
          text: randomResponse,
          sender: 'wren',
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, wrenResponse])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">Meditation Session</h1>
        <p className="text-gray-400 mt-1">Let Wren guide you to inner peace</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share how you're feeling..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}