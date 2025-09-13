'use client'

import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <Link href="/" className="text-2xl font-bold text-green-400">
          Wren
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-green-400 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-green-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/about" className="text-green-400">
            About
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-light mb-8 text-center">About Wren</h1>
        
        <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
          <p>
            Wren is your personal meditation assistant, designed to guide you on a journey 
            toward inner peace and mindfulness. In our fast-paced world, finding moments 
            of calm can be challenging, but Wren makes it simple and accessible.
          </p>
          
          <p>
            Through gentle conversation and personalized guidance, Wren helps you:
          </p>
          
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Develop a consistent meditation practice</li>
            <li>Learn breathing techniques for stress relief</li>
            <li>Find moments of mindfulness throughout your day</li>
            <li>Track your emotional well-being</li>
            <li>Build resilience and inner strength</li>
          </ul>
          
          <p>
            Whether you're a beginner or an experienced meditator, Wren adapts to your 
            needs and provides the support you need to cultivate a peaceful mind.
          </p>
          
          <div className="text-center pt-8">
            <Link href="/dashboard">
              <button className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full transition-all duration-300 hover:scale-105">
                Start Your Journey
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}