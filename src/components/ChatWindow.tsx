'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StressSlider from './StressSlider'

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
      id: 1,
      text: "Welcome to your meditation journey. I'm Wren, your personal meditation assistant. How are you feeling today?",
      sender: 'wren',
      timestamp: new Date().toLocaleTimeString()
    },
    ...initialMessages
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [currentStressLevel, setCurrentStressLevel] = useState(5)
  const [initialStressLevel, setInitialStressLevel] = useState(5)
  const [showStressSlider, setShowStressSlider] = useState(true)
  const [sessionStartTime] = useState(new Date())

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
        const stressResponses = {
          low: [
            "I'm glad you're feeling calm! Let's maintain this peaceful state with a gentle breathing exercise.",
            "It's wonderful that you're in a good place. Would you like to try a gratitude meditation?"
          ],
          medium: [
            "I understand. Let's take a moment to breathe together. Would you like to start with a 5-minute breathing exercise?",
            "That's completely normal. Sometimes we all need a moment to pause and reconnect with ourselves."
          ],
          high: [
            "I can sense you're feeling overwhelmed. Let's start with some deep breathing to help you feel more grounded.",
            "When stress feels intense, focusing on your breath can be incredibly helpful. Let's try a calming technique together."
          ]
        }
        
        let responseCategory = 'medium'
        if (currentStressLevel <= 3) responseCategory = 'low'
        else if (currentStressLevel >= 7) responseCategory = 'high'
        
        const responses = stressResponses[responseCategory as keyof typeof stressResponses]
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

  const handleStressChange = (level: number) => {
    // Set initial stress level if this is the first time
    if (messages.length <= 1) {
      setInitialStressLevel(level)
    }
    setCurrentStressLevel(level)
    
    // Auto-send a message about stress level change
    const stressMessage: Message = {
      id: messages.length + 1,
      text: `My current stress level is ${level}/10`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, stressMessage])
    
    // Wren's response to stress level
    setTimeout(() => {
      let response = ''
      if (level <= 3) {
        response = "That's great! You seem to be in a calm state. Let's maintain this with some mindful breathing."
      } else if (level <= 6) {
        response = "I understand you're feeling moderately stressed. Let's work together to bring that level down."
      } else {
        response = "I can see you're experiencing high stress. Let's focus on some immediate calming techniques."
      }
      
      const wrenResponse: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'wren',
        timestamp: new Date().toLocaleTimeString()
      }
      setMessages(prev => [...prev, wrenResponse])
    }, 800)
  }

  const completeSession = () => {
    const sessionDuration = Math.round((new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60))
    const params = new URLSearchParams({
      duration: Math.max(sessionDuration, 1).toString(),
      stressBefore: initialStressLevel.toString(),
      stressAfter: currentStressLevel.toString(),
      sessionType: 'Guided Chat Session'
    })
    
    router.push(`/session-summary?${params.toString()}`)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-700">
        <h1 className="text-xl md:text-2xl font-semibold">Meditation Session</h1>
        <p className="text-gray-400 mt-1 text-sm md:text-base">Let Wren guide you to inner peace</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-lg touch-manipulation ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stress Slider */}
      {showStressSlider && (
        <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-700">
          <StressSlider 
            onChange={handleStressChange}
            value={currentStressLevel}
          />
          <button
            onClick={() => setShowStressSlider(false)}
            className="mt-3 text-xs text-gray-500 hover:text-gray-400 transition-colors touch-manipulation py-1"
          >
            Hide stress meter
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 md:p-6 border-t border-gray-700 bg-gray-900">
        {/* Mobile-optimized input layout */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-3 md:mb-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share how you're feeling..."
            className="flex-1 px-3 md:px-4 py-3 md:py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base touch-manipulation"
          />
          <div className="flex gap-2 sm:gap-0">
            {!showStressSlider && (
              <button
                onClick={() => setShowStressSlider(true)}
                className="flex-1 sm:flex-none px-3 md:px-4 py-3 md:py-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-600 rounded-lg transition-colors text-sm touch-manipulation min-h-[44px]"
              >
                Stress Meter
              </button>
            )}
            <button
              onClick={sendMessage}
              className="flex-1 sm:flex-none px-4 md:px-6 py-3 md:py-2 bg-green-600 hover:bg-green-500 active:bg-green-500 rounded-lg transition-colors touch-manipulation min-h-[44px] font-medium"
            >
              Send
            </button>
          </div>
        </div>
        
        {/* Complete Session Button */}
        <div className="flex justify-center">
          <button
            onClick={completeSession}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 active:from-green-600 active:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg touch-manipulation min-h-[44px]"
          >
            Complete Session
          </button>
        </div>
      </div>
    </div>
  )
}