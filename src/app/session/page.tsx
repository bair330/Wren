'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionChatShell } from '@/components/ChatShell';
import { SessionBreathingBackdrop } from '@/components/BreathingBackdrop';
import { PreSessionStressSlider } from '@/components/StressSlider';
import { NavBarSpacer } from '@/components/NavBar';
import { useMeditationStore, useSessionState } from '@/lib/store';
import { cn } from '@/lib/utils';

type SessionState = 'idle' | 'intro' | 'breathing' | 'guidance' | 'complete';

const SCRIPTED_MESSAGES = {
  intro: "Hello! I'm Wren, your meditation guide. I'm here to help you find a moment of peace and calm. Let's begin this journey together. How are you feeling right now?",
  breathing: "Perfect. Let's start with some gentle breathing. Take a deep breath in through your nose... hold it for a moment... and slowly exhale through your mouth. Feel your body beginning to relax with each breath.",
  guidance: "Wonderful. Now, let's deepen this experience. Close your eyes if you feel comfortable, and imagine yourself in a peaceful place. Perhaps a quiet forest, a calm beach, or anywhere that brings you serenity. Let your mind settle into this space.",
  complete: "You've done beautifully. Take a moment to notice how you feel right now compared to when we started. This sense of calm is always available to you. Let's see how this session has helped you."
};

const NEXT_STEP_TEXTS = {
  intro: 'Begin Breathing',
  breathing: 'Continue Guidance',
  guidance: 'Complete Session',
  complete: 'View Results'
};

export default function SessionPage() {
  const router = useRouter();
  const {
    sessionState,
    messages,
    stressPre,
    setSessionState,
    addMessage,
    setStressPre,
    advanceToNextStep,
    resetSession
  } = useMeditationStore();
  
  const [showStressSlider, setShowStressSlider] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Check if this is the first visit to session page
    if (stressPre === null) {
      setShowStressSlider(true);
    }
  }, [stressPre]);
  

  
  const handleStressConfirm = (level: number) => {
    setStressPre(level);
    setShowStressSlider(false);
    setSessionState('intro');
  };
  
  const handleSendMessage = (text: string) => {
    addMessage('user', text);
  };
  
  const handleNextStep = () => {
    advanceToNextStep();
  };
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--bg)] relative">
      {/* Breathing backdrop */}
      <SessionBreathingBackdrop />
      
      {/* Navigation spacer */}
      <NavBarSpacer />
      
      {/* Pre-session stress slider modal */}
      {showStressSlider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={cn(
            'bg-[var(--panel)] rounded-2xl border border-[var(--subtle)]/20 shadow-2xl',
            'max-w-md w-full p-8 transform transition-all duration-300',
            'animate-in fade-in-0 zoom-in-95'
          )}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[var(--text)] mb-3">
                Welcome to Your Session
              </h2>
              <p className="text-[var(--subtle)] leading-relaxed">
                Before we begin, let's check in with how you're feeling right now.
              </p>
            </div>
            
            <PreSessionStressSlider
              value={1}
              onChange={handleStressConfirm}
              className="mb-6"
            />
            
            <div className="text-center">
              <p className="text-xs text-[var(--subtle)]">
                This helps us track your progress and personalize your experience.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main chat interface */}
      <div className="h-[calc(100vh-4rem)] relative z-10">
        <SessionChatShell
          messages={messages}
          onSendMessage={handleSendMessage}
          onNextStep={handleNextStep}
          loading={false}
          showNextStep={sessionState !== 'idle' && sessionState !== 'complete'}
          nextStepText={NEXT_STEP_TEXTS[sessionState as keyof typeof NEXT_STEP_TEXTS] || 'Next Step'}
        />
      </div>
      
      {/* Session state indicator */}
      <div className="fixed bottom-4 left-4 z-20">
        <div className="px-3 py-2 rounded-lg bg-[var(--panel)]/80 backdrop-blur-sm border border-[var(--subtle)]/20 text-xs text-[var(--subtle)]">
          {sessionState === 'idle' && 'Preparing session...'}
          {sessionState === 'intro' && 'Introduction'}
          {sessionState === 'breathing' && 'Breathing Exercise'}
          {sessionState === 'guidance' && 'Guided Meditation'}
          {sessionState === 'complete' && 'Session Complete'}
        </div>
      </div>
      
      {/* Progress indicator */}
      {sessionState !== 'idle' && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {['intro', 'breathing', 'guidance', 'complete'].map((state, index) => {
              const isActive = state === sessionState;
              const isCompleted = ['intro', 'breathing', 'guidance', 'complete'].indexOf(sessionState) > index;
              
              return (
                <div
                  key={state}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    isActive && 'bg-[var(--accent)] scale-125',
                    isCompleted && 'bg-[var(--accent)]/60',
                    !isActive && !isCompleted && 'bg-[var(--subtle)]/30'
                  )}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}