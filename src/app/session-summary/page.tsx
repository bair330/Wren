'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import SessionSummary from '@/components/SessionSummary'

function SessionSummaryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get session data from URL params or use defaults
  const duration = parseInt(searchParams.get('duration') || '5')
  const stressBefore = parseInt(searchParams.get('stressBefore') || '8')
  const stressAfter = parseInt(searchParams.get('stressAfter') || '4')
  const sessionType = searchParams.get('sessionType') || 'Breathing Exercise'

  const handleContinue = () => {
    router.push('/dashboard')
  }

  return (
    <SessionSummary
      duration={duration}
      stressBefore={stressBefore}
      stressAfter={stressAfter}
      sessionType={sessionType}
      onContinue={handleContinue}
    />
  )
}

export default function SessionSummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    }>
      <SessionSummaryContent />
    </Suspense>
  )
}