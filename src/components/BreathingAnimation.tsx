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
        return inhaleTime
      case 'hold':
        return 0
      case 'exhale':
        return exhaleTime
      default:
        return 1000
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
      <div className="relative flex items-center justify-center w-96 h-96 overflow-hidden">
        {/* Outermost glow */}
        <div 
          className={`absolute w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-3xl transition-all ease-in-out ${
            isAnimating ? getCircleScale() : 'scale-100'
          }`}
          style={{
            transitionDuration: `${isAnimating ? getTransitionDuration() : 1000}ms`
          }}
        />
        
        {/* Outer glow ring */}
        <div 
          className={`absolute w-64 h-64 rounded-full bg-[var(--accent)]/20 blur-xl transition-all ease-in-out ${
            isAnimating ? getCircleScale() : 'scale-100'
          }`}
          style={{
            transitionDuration: `${isAnimating ? getTransitionDuration() : 1000}ms`
          }}
        />
        
        {/* Main breathing orb - Siri-like design */}
        <div 
          className={`relative w-48 h-48 rounded-full transition-all ease-in-out ${
            isAnimating ? getCircleScale() : 'scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent) 90%, transparent), color-mix(in srgb, var(--accent) 80%, transparent), color-mix(in srgb, var(--accent) 70%, transparent))',
            boxShadow: `
              0 0 60px color-mix(in srgb, var(--accent) 40%, transparent),
              0 0 120px color-mix(in srgb, var(--accent) 20%, transparent),
              inset 0 0 60px rgba(255, 255, 255, 0.1)
            `,
            transitionDuration: `${isAnimating ? getTransitionDuration() : 1000}ms`
          }}
        >
          {/* Multiple layered inner circles for depth */}
          <div 
            className="absolute inset-2 rounded-full transition-all duration-2000 ease-in-out"
            style={{
              background: 'radial-gradient(circle at 40% 40%, color-mix(in srgb, var(--accent) 60%, transparent), color-mix(in srgb, var(--accent) 40%, transparent))',
              filter: 'blur(1px)'
            }}
          />
          
          <div 
            className="absolute inset-6 rounded-full transition-all duration-3000 ease-in-out"
            style={{
              background: 'radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--accent) 80%, white), color-mix(in srgb, var(--accent) 30%, transparent))',
              filter: 'blur(0.5px)'
            }}
          />
          
          {/* Gentle pulsing inner core */}
          <div 
            className={`absolute inset-8 rounded-full transition-all duration-1000 ease-in-out ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{
              background: 'radial-gradient(circle, color-mix(in srgb, var(--accent) 90%, white), color-mix(in srgb, var(--accent) 60%, white))',
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
        <h3 className="text-3xl font-light text-[var(--accent)]">
          {isActive ? getPhaseText() : 'Ready to Begin'}
        </h3>
        <p className="text-[var(--subtle)] text-base">
          {isActive ? 'Follow the orb with your breath' : 'Press start to begin breathing exercise'}
        </p>
      </div>

      {/* Breathing pattern indicator */}
      {isActive && (
        <div className="flex items-center space-x-6 text-base text-[var(--subtle)] mt-6">
          <span className={phase === 'inhale' ? 'text-[var(--accent)] font-medium' : ''}>
            In: {inhaleTime / 1000}s
          </span>
          <span className={phase === 'hold' ? 'text-[var(--accent)] font-medium' : ''}>
            Hold: {holdTime / 1000}s
          </span>
          <span className={phase === 'exhale' ? 'text-[var(--accent)] font-medium' : ''}>
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