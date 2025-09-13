'use client';

import { useState, useEffect } from 'react';

interface BreathingAnimationProps {
  isActive?: boolean
  inhaleTime?: number
  holdTime?: number
  exhaleTime?: number
  onCycleComplete?: () => void
}

export default function BreathingAnimation({
  isActive = false,
  inhaleTime = 4000,
  holdTime = 2000,
  exhaleTime = 6000,
  onCycleComplete
}: BreathingAnimationProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isActive) {
      setIsAnimating(false)
      return
    }

    setIsAnimating(true)
    let timeoutId: ReturnType<typeof setTimeout>

    const runCycle = () => {
      // Inhale phase
      setPhase('inhale')
      timeoutId = setTimeout(() => {
        // Hold phase
        setPhase('hold')
        timeoutId = setTimeout(() => {
          // Exhale phase
          setPhase('exhale')
          timeoutId = setTimeout(() => {
            onCycleComplete?.()
            if (isActive) {
              runCycle() // Continue the cycle
            }
          }, exhaleTime)
        }, holdTime)
      }, inhaleTime)
    }

    runCycle()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isActive, inhaleTime, holdTime, exhaleTime, onCycleComplete])

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-150'
      case 'hold':
        return 'scale-150'
      case 'exhale':
        return 'scale-75'
      default:
        return 'scale-100'
    }
  }

  const getTransitionDuration = () => {
    switch (phase) {
      case 'inhale':
        return `duration-[${inhaleTime}ms]`
      case 'hold':
        return 'duration-0'
      case 'exhale':
        return `duration-[${exhaleTime}ms]`
      default:
        return 'duration-1000'
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe Out'
      default:
        return 'Ready'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-16">
      {/* Breathing Circle */}
      <div className="relative flex items-center justify-center">
        {/* Outermost glow */}
        <div 
          className={`absolute w-80 h-80 rounded-full bg-green-400/10 blur-3xl transition-all ease-in-out ${
            isAnimating ? getTransitionDuration() : 'duration-1000'
          } ${
            isAnimating ? getCircleScale() : 'scale-100'
          }`}
        />
        
        {/* Outer glow ring */}
        <div 
          className={`absolute w-64 h-64 rounded-full bg-green-400/20 blur-xl transition-all ease-in-out ${
            isAnimating ? getTransitionDuration() : 'duration-1000'
          } ${
            isAnimating ? getCircleScale() : 'scale-100'
          }`}
        />
        
        {/* Main breathing orb - Siri-like design */}
        <div 
          className={`relative w-48 h-48 rounded-full transition-all ease-in-out ${
            isAnimating ? getTransitionDuration() : 'duration-1000'
          } ${
            isAnimating ? getCircleScale() : 'scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.8), rgba(21, 128, 61, 0.7))',
            boxShadow: `
              0 0 60px rgba(34, 197, 94, 0.4),
              0 0 120px rgba(34, 197, 94, 0.2),
              inset 0 0 60px rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Multiple layered inner circles for depth */}
          <div 
            className="absolute inset-2 rounded-full transition-all duration-2000 ease-in-out"
            style={{
              background: 'radial-gradient(circle at 40% 40%, rgba(74, 222, 128, 0.6), rgba(34, 197, 94, 0.4))',
              filter: 'blur(1px)'
            }}
          />
          
          <div 
            className="absolute inset-6 rounded-full transition-all duration-3000 ease-in-out"
            style={{
              background: 'radial-gradient(circle at 50% 30%, rgba(134, 239, 172, 0.8), rgba(74, 222, 128, 0.3))',
              filter: 'blur(0.5px)'
            }}
          />
          
          {/* Gentle pulsing inner core */}
          <div 
            className={`absolute inset-8 rounded-full transition-all duration-1000 ease-in-out ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(187, 247, 208, 0.9), rgba(134, 239, 172, 0.6))',
              animation: isAnimating ? 'gentle-pulse 2s ease-in-out infinite' : 'none'
            }}
          />
          
          {/* Subtle center highlight */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3))',
              filter: 'blur(1px)'
            }}
          />
        </div>
      </div>

      {/* Phase indicator with increased spacing */}
      <div className="text-center space-y-3 mt-8">
        <h3 className="text-3xl font-light text-green-400">
          {isActive ? getPhaseText() : 'Ready to Begin'}
        </h3>
        <p className="text-gray-400 text-base">
          {isActive ? 'Follow the orb with your breath' : 'Press start to begin breathing exercise'}
        </p>
      </div>

      {/* Breathing pattern indicator */}
      {isActive && (
        <div className="flex items-center space-x-6 text-base text-gray-500 mt-6">
          <span className={phase === 'inhale' ? 'text-green-400 font-medium' : ''}>
            In: {inhaleTime / 1000}s
          </span>
          <span className={phase === 'hold' ? 'text-green-400 font-medium' : ''}>
            Hold: {holdTime / 1000}s
          </span>
          <span className={phase === 'exhale' ? 'text-green-400 font-medium' : ''}>
            Out: {exhaleTime / 1000}s
          </span>
        </div>
      )}
      
      <style jsx>{`
        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}