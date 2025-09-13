'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface MeditationType {
  id: string
  title: string
  description: string
  icon: string
  duration: string
  benefits: string[]
  recommended: boolean
}

export default function MeditationTypeSelection() {
  const router = useRouter()
  const [stressLevel, setStressLevel] = useState(5)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    // Get stress level from session storage
    const savedStressLevel = sessionStorage.getItem('userStressLevel')
    if (savedStressLevel) {
      setStressLevel(parseInt(savedStressLevel))
    }
  }, [])

  const getMeditationTypes = (stressLevel: number): MeditationType[] => {
    const baseTypes: MeditationType[] = [
      {
        id: 'timer',
        title: 'Meditation Timer',
        description: 'Silent meditation with customizable timer and ambient sounds',
        icon: '⏰',
        duration: '5-60 minutes',
        benefits: ['Deep focus', 'Self-awareness', 'Mental clarity'],
        recommended: stressLevel <= 4
      },
      {
        id: 'breathing',
        title: 'Breathing Exercise',
        description: 'Guided breathing patterns to calm your mind and body',
        icon: '🫁',
        duration: '3-15 minutes',
        benefits: ['Instant calm', 'Stress relief', 'Better focus'],
        recommended: stressLevel >= 5
      },
      {
        id: 'audio',
        title: 'Guided Audio',
        description: 'Soothing nature sounds and ambient music for relaxation',
        icon: '🎵',
        duration: '10-30 minutes',
        benefits: ['Deep relaxation', 'Better sleep', 'Anxiety relief'],
        recommended: stressLevel >= 7
      }
    ]

    // Sort by recommendation (recommended first)
    return baseTypes.sort((a, b) => {
      if (a.recommended && !b.recommended) return -1
      if (!a.recommended && b.recommended) return 1
      return 0
    })
  }

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
  }

  const handleStartMeditation = async () => {
    if (!selectedType) return
    
    setIsStarting(true)
    
    // Store selected meditation type
    sessionStorage.setItem('selectedMeditationType', selectedType)
    
    // Navigate to dashboard with selected meditation type as tab parameter
    const tabMap: { [key: string]: string } = {
      'timer': 'timer',
      'breathing': 'breathing', 
      'audio': 'audio'
    }
    
    const tab = tabMap[selectedType] || 'timer'
    router.push(`/dashboard?tab=${tab}`)
    
    setIsStarting(false)
  }

  const getStressLevelText = (level: number) => {
    if (level <= 3) return 'Low Stress'
    if (level <= 6) return 'Moderate Stress'
    return 'High Stress'
  }

  const getPersonalizedMessage = (level: number) => {
    if (level <= 3) {
      return "You're feeling calm! Let's maintain this peaceful state with gentle meditation."
    } else if (level <= 6) {
      return "You're experiencing some stress. Let's work together to bring you back to center."
    } else {
      return "You're feeling overwhelmed. Let's start with immediate stress relief techniques."
    }
  }

  const meditationTypes = getMeditationTypes(stressLevel)

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: 'var(--panel)' }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stressLevel <= 3 ? 'var(--accent)' : stressLevel <= 6 ? '#FFA500' : '#FF6B6B' }}></div>
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {getStressLevelText(stressLevel)} ({stressLevel}/10)
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            Choose Your Meditation
          </h1>
          <p className="text-base md:text-lg mb-4" style={{ color: 'var(--subtle)' }}>
            {getPersonalizedMessage(stressLevel)}
          </p>
        </div>

        {/* Meditation Types Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {meditationTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                selectedType === type.id ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: 'var(--panel)',
                borderColor: selectedType === type.id ? 'var(--accent)' : 'transparent',
                '--tw-ring-color': 'var(--accent)'
              } as React.CSSProperties}
            >
              {/* Recommended Badge */}
              {type.recommended && (
                <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }}>
                  Recommended
                </div>
              )}
              
              {/* Icon */}
              <div className="text-4xl mb-4 text-center">{type.icon}</div>
              
              {/* Content */}
              <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
                {type.title}
              </h3>
              <p className="text-sm md:text-base mb-4" style={{ color: 'var(--subtle)' }}>
                {type.description}
              </p>
              
              {/* Duration */}
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm" style={{ color: 'var(--text)' }}>{type.duration}</span>
              </div>
              
              {/* Benefits */}
              <div className="space-y-1">
                {type.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <span className="text-xs md:text-sm" style={{ color: 'var(--subtle)' }}>{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* Selection Indicator */}
              {selectedType === type.id && (
                <div className="absolute inset-0 rounded-2xl border-2 pointer-events-none" style={{ borderColor: 'var(--accent)' }}>
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                    <svg className="w-4 h-4" style={{ color: 'var(--text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={handleStartMeditation}
            disabled={!selectedType || isStarting}
            className="px-8 py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: selectedType ? 'linear-gradient(to right, var(--accent), var(--accent-2))' : 'var(--subtle)',
              color: 'var(--text)'
            }}
          >
            {isStarting ? 'Starting...' : selectedType ? 'Start Meditation' : 'Select a Meditation Type'}
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.back()}
            className="text-sm transition-colors" 
            style={{ color: 'var(--subtle)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--subtle)'}
          >
            ← Back to Stress Assessment
          </button>
        </div>
      </div>
    </div>
  )
}