'use client'

import ChatWindow from '@/components/ChatWindow'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-green-400">
                Wren
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/session-summary?duration=5&stressBefore=8&stressAfter=3&sessionType=Demo%20Session"
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors text-sm"
              >
                View Sample Summary
              </Link>
              <Link href="/about" className="hover:text-green-400 transition-colors">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Interface */}
      <div className="h-[calc(100vh-4rem)]">
        <ChatWindow />
      </div>
    </div>
  )
}