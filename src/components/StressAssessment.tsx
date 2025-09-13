'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StressSlider from './StressSlider'

interface StressAssessmentProps {
  onComplete?: (stressLevel: number) => void
}

export default function StressAssessment({ onComplete }: StressAssessmentProps) {
  const router = useRouter()
  const [stressLevel, setStressLevel] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStressChange = (level: number) => {
    setStressLevel(level)
  }

  const handleContinue = async () => {
    setIsSubmitting(true)
    
    // Store stress level in session storage for the next component
    sessionStorage.setItem('userStressLevel', stressLevel.toString())
    
    if (onComplete) {
      onComplete(stressLevel)
    } else {
      // Navigate to meditation type selection
      router.push('/meditation-selection')
    }
    
    setIsSubmitting(false)
  }

  const getStressDescription = (level: number) => {
    if (level <= 3) return "You're feeling quite calm and relaxed."
    if (level <= 6) return "You're experiencing moderate stress levels."
    return "You're feeling quite stressed and overwhelmed."
  }

  const getStressColor = (level: number) => {
    if (level <= 3) return 'var(--accent)'
    if (level <= 6) return '#FFA500'
    return '#FF6B6B'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--panel)' }}>
            <svg className="w-8 h-8" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            How are you feeling?
          </h1>
          <p className="text-base md:text-lg" style={{ color: 'var(--subtle)' }}>
            Let's assess your current stress level to personalize your meditation experience.
          </p>
        </div>

        {/* Stress Assessment Card */}
        <div className="rounded-2xl p-6 md:p-8 shadow-lg" style={{ backgroundColor: 'var(--panel)' }}>
          {/* Current Level Display */}
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: getStressColor(stressLevel) }}>
              {stressLevel}/10
            </div>
            <p className="text-sm md:text-base" style={{ color: 'var(--text)' }}>
              {getStressDescription(stressLevel)}
            </p>
          </div>

          {/* Stress Slider */}
          <div className="mb-8">
            <StressSlider 
              onChange={handleStressChange}
              value={stressLevel}
              size="lg"
              showLabels={true}
            />
          </div>

          {/* Helpful Tips */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>💡 Quick Tip</h3>
            <p className="text-xs md:text-sm" style={{ color: 'var(--subtle)' }}>
              {stressLevel <= 3 && "Great! You're in a calm state. We'll help you maintain this peaceful feeling."}
              {stressLevel > 3 && stressLevel <= 6 && "It's normal to feel some stress. We'll guide you through techniques to find your center."}
              {stressLevel > 6 && "Take a deep breath. We're here to help you find relief and inner peace."}
            </p>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: 'linear-gradient(to right, var(--accent), var(--accent-2))',
              color: 'var(--text)'
            }}
          >
            {isSubmitting ? 'Processing...' : 'Continue to Meditation Options'}
          </button>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs md:text-sm mt-6" style={{ color: 'var(--subtle)' }}>
          Your stress level helps us recommend the most suitable meditation practices for you.
        </p>
      </div>
    </div>
  )
}