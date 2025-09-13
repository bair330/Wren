'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatWindow from '@/components/ChatWindow'
import MeditationTimer from '@/components/MeditationTimer'
import BreathingAnimation from '@/components/BreathingAnimation'
import AudioControls from '@/components/AudioControls'
import Link from 'next/link'
import { Timer, Wind, Volume2, MessageCircle, Heart, Clock } from 'lucide-react'

type ActiveTab = 'chat' | 'timer' | 'breathing' | 'audio'

export default function Dashboard() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<ActiveTab>('timer')
  const [isBreathingActive, setIsBreathingActive] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['chat', 'timer', 'breathing', 'audio'].includes(tab)) {
      setActiveTab(tab as ActiveTab)
    }
  }, [searchParams])

  const handleBreathingToggle = () => {
    setIsBreathingActive(!isBreathingActive)
  }

  const handleTimerStart = () => {
    console.log('Timer started')
  }

  const handleTimerStop = () => {
    console.log('Timer stopped')
  }

  const handleSessionComplete = () => {
    console.log('Session completed')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Navigation */}
      <nav className="bg-[var(--panel)] border-b border-[var(--subtle)]/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Heart className="w-6 h-6 text-[var(--accent)]" fill="currentColor" />
              <span className="text-xl font-semibold text-[var(--text)]">Wren</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/session-summary?duration=5&stressBefore=8&stressAfter=3&sessionType=Demo%20Session"
              className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent)]/80 rounded-lg transition-colors text-sm text-[var(--bg)]"
            >
              View Sample Summary
            </Link>
            <Link href="/about" className="hover:text-[var(--accent)] transition-colors">
              About
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-64 bg-[var(--panel)] border-r border-[var(--subtle)]/20 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('timer')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'timer'
                  ? 'bg-[var(--accent)] text-[var(--bg)]'
                  : 'text-[var(--subtle)] hover:bg-[var(--panel)]/80 hover:text-[var(--text)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5" />
                <span>Meditation Timer</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('breathing')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'breathing'
                  ? 'bg-[var(--accent)] text-[var(--bg)]'
                  : 'text-[var(--subtle)] hover:bg-[var(--panel)]/80 hover:text-[var(--text)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Wind className="w-5 h-5" />
                <span>Breathing Exercise</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'audio'
                  ? 'bg-[var(--accent)] text-[var(--bg)]'
                  : 'text-[var(--subtle)] hover:bg-[var(--panel)]/80 hover:text-[var(--text)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5" />
                <span>Audio Controls</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'chat'
                  ? 'bg-[var(--accent)] text-[var(--bg)]'
                  : 'text-[var(--subtle)] hover:bg-[var(--panel)]/80 hover:text-[var(--text)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Wren</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[var(--bg)] p-6">
          {activeTab === 'timer' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--accent)] mb-6">Meditation Timer</h2>
              <MeditationTimer 
                onSessionComplete={handleSessionComplete}
                onTimerStart={handleTimerStart}
                onTimerStop={handleTimerStop}
              />
            </div>
          )}

          {activeTab === 'breathing' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--accent)] mb-6">Breathing Exercise</h2>
              <div className="text-center mb-6">
                <button
                  onClick={handleBreathingToggle}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isBreathingActive 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-[var(--bg)]'
                  }`}
                >
                  {isBreathingActive ? 'Stop Breathing Exercise' : 'Start Breathing Exercise'}
                </button>
              </div>
              <BreathingAnimation 
                isActive={isBreathingActive}
                inhaleTime={4000}
                holdTime={2000}
                exhaleTime={6000}
                onCycleComplete={() => console.log('Breathing cycle complete')}
              />
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[var(--accent)] mb-6">Meditation Sounds</h2>
              <AudioControls 
                onPlayStateChange={setAudioPlaying}
                className="w-full"
              />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-full">
              <ChatWindow />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}