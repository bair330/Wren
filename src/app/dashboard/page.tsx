'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MessageCircle, Home, Settings, User } from 'lucide-react'

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to your meditation journey. I'm Wren, your personal meditation assistant. How are you feeling today?",
      sender: 'wren',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      
      // Simulate Wren's response
      setTimeout(() => {
        const wrenResponse = {
          id: messages.length + 2,
          text: "I understand. Let's take a moment to breathe together. Would you like to start with a 5-minute breathing exercise?",
          sender: 'wren',
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, wrenResponse])
      }, 1000)
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="text-2xl font-bold text-green-400">
            Wren
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg bg-green-600/20 text-green-400">
            <MessageCircle size={20} />
            <span>Chat</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <User size={20} />
            <span>Profile</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
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
    </div>
  )
}