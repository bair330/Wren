'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold text-green-400">
          Wren
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-green-400 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-green-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/about" className="hover:text-green-400 transition-colors">
            About
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <h1 className="text-6xl md:text-8xl font-light text-center mb-12 text-gray-100">
          Breathe. Relax. Begin.
        </h1>
        
        <Link href="/dashboard">
          <button className="px-12 py-6 text-xl font-medium bg-green-600 hover:bg-green-500 text-white rounded-full transition-all duration-300 pulse-glow blink hover:scale-105">
            Start Meditation
          </button>
        </Link>
      </div>
    </div>
  )
}