'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { StartButton } from '@/components/GlowButton';
import { LandingBreathingBackdrop } from '@/components/BreathingBackdrop';
import { HeaderStreakBadge } from '@/components/StreakBadge';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Stagger the welcome animation
    const timer = setTimeout(() => setShowWelcome(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  const handleStartMeditation = () => {
    router.push('/session');
  };
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
      {/* Breathing backdrop */}
      <LandingBreathingBackdrop />
      
      {/* Header with streak */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-[var(--bg)]" fill="currentColor" />
            </div>
            <h1 className="text-xl font-semibold text-[var(--text)]">
              Wren
            </h1>
          </div>
          
          <HeaderStreakBadge />
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero section */}
          <div className={cn(
            'transition-all duration-1000 ease-out',
            showWelcome 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          )}>
            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-light text-[var(--text)] mb-6 leading-tight">
              <span className="block">Breathe.</span>
              <span className="block text-[var(--accent)] font-medium">Relax.</span>
              <span className="block">Begin.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-[var(--subtle)] mb-12 leading-relaxed max-w-2xl mx-auto">
              A gentle, guided meditation—just press Start.
            </p>
            
            {/* CTA Button */}
            <div className="mb-16">
              <StartButton
                onClick={handleStartMeditation}
                glow={true}
                className="text-lg px-12 py-4 shadow-2xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Meditation
              </StartButton>
            </div>
            
            {/* Features grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--panel)] flex items-center justify-center border border-[var(--subtle)]/20">
                  <div className="w-3 h-3 bg-[var(--accent)] rounded-full animate-pulse" />
                </div>
                <h3 className="text-lg font-medium text-[var(--text)] mb-2">
                  Guided Breathing
                </h3>
                <p className="text-[var(--subtle)] text-sm leading-relaxed">
                  Follow gentle breathing exercises designed to calm your mind and body.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--panel)] flex items-center justify-center border border-[var(--subtle)]/20">
                  <Heart className="w-6 h-6 text-[var(--accent-2)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--text)] mb-2">
                  Stress Relief
                </h3>
                <p className="text-[var(--subtle)] text-sm leading-relaxed">
                  Track your stress levels before and after each session to see your progress.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--panel)] flex items-center justify-center border border-[var(--subtle)]/20">
                  <Sparkles className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--text)] mb-2">
                  Daily Practice
                </h3>
                <p className="text-[var(--subtle)] text-sm leading-relaxed">
                  Build a consistent meditation habit with streak tracking and gentle reminders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[var(--subtle)] text-sm">
            Take a moment for yourself. You deserve this peace.
          </p>
        </div>
      </footer>
      
      {/* Ambient glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--accent)]/5 rounded-full blur-3xl" />
        
        {/* Bottom glow */}
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--accent-2)]/5 rounded-full blur-3xl" />
        
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[var(--accent)]/3 via-transparent to-transparent rounded-full" />
      </div>
    </div>
  );
}