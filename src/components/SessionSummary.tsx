'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, TrendingDown, Clock, Heart } from 'lucide-react'

interface SessionSummaryProps {
  duration?: number // in minutes
  stressBefore?: number // 1-10 scale
  stressAfter?: number // 1-10 scale
  sessionType?: string
  onContinue?: () => void
}

export default function SessionSummary({
  duration = 5,
  stressBefore = 8,
  stressAfter = 4,
  sessionType = 'Breathing Exercise',
  onContinue
}: SessionSummaryProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const stressReduction = stressBefore - stressAfter
  const improvementPercentage = Math.round((stressReduction / stressBefore) * 100)

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getEncouragingMessage = () => {
    if (stressReduction >= 4) {
      return "Amazing progress! You've made a significant improvement in your stress levels."
    } else if (stressReduction >= 2) {
      return "Great work! You're on the right path to better mental wellness."
    } else if (stressReduction >= 1) {
      return "Good job! Every small step counts towards your wellbeing."
    } else {
      return "Remember, meditation is a practice. Keep going, you're building valuable skills."
    }
  }

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-400'
    if (level <= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 md:space-y-8">
        {/* Success Icon */}
        <div className="text-center pt-4 md:pt-0">
          <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-500/20 mb-3 md:mb-4 transition-all duration-1000 ${
            showAnimation ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}>
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-green-400 mb-2">Session Complete!</h1>
          <p className="text-sm md:text-base text-gray-400">{sessionType}</p>
        </div>

        {/* Session Stats */}
        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Duration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-sm md:text-base text-gray-300">Duration</span>
            </div>
            <span className="text-lg md:text-xl font-semibold text-white">{duration} min</span>
          </div>

          {/* Stress Levels */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center space-x-3 mb-3 md:mb-4">
              <TrendingDown className="w-5 h-5 text-green-400" />
              <span className="text-sm md:text-base text-gray-300">Stress Level Progress</span>
            </div>
            
            {/* Before/After Comparison */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-gray-700 rounded-xl">
                <p className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2">Before</p>
                <p className={`text-2xl md:text-3xl font-bold ${getStressColor(stressBefore)}`}>
                  {stressBefore}/10
                </p>
              </div>
              <div className="text-center p-3 md:p-4 bg-gray-700 rounded-xl">
                <p className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2">After</p>
                <p className={`text-2xl md:text-3xl font-bold ${getStressColor(stressAfter)}`}>
                  {stressAfter}/10
                </p>
              </div>
            </div>

            {/* Improvement Indicator */}
            {stressReduction > 0 && (
              <div className={`text-center p-3 md:p-4 bg-green-500/10 rounded-xl border border-green-500/20 transition-all duration-1000 ${
                showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-1 md:mb-2">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  <span className="text-sm md:text-base text-green-400 font-semibold">
                    {improvementPercentage}% Improvement
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-300">
                  Reduced by {stressReduction} point{stressReduction !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-2xl p-4 md:p-6 border border-green-500/20">
          <p className="text-center text-sm md:text-base text-gray-200 leading-relaxed">
            {getEncouragingMessage()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4 md:pb-0">
          <button
            onClick={onContinue}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-4 md:py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation min-h-[48px] text-base md:text-lg"
          >
            <span>Continue Journey</span>
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-semibold py-3 md:py-3 px-6 rounded-xl transition-colors duration-200 touch-manipulation min-h-[44px] text-sm md:text-base"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Quick Tips */}
        <div className="text-center text-xs md:text-sm text-gray-400 pb-4">
          <p>💡 Tip: Regular practice leads to better results</p>
        </div>
      </div>
    </div>
  )
}