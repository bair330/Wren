'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home, RotateCcw, TrendingDown, TrendingUp } from 'lucide-react';
import { PostSessionStressSlider } from '@/components/StressSlider';
import { DetailedStreakBadge } from '@/components/StreakBadge';
import { ResultsBreathingBackdrop } from '@/components/BreathingBackdrop';
import { StartButton, LinkButton } from '@/components/GlowButton';
import { NavBarSpacer } from '@/components/NavBar';
import { useMeditationStore } from '@/lib/store';
import { updateStreakData, getStreakData } from '@/lib/storage';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  const router = useRouter();
  const {
    stressPre,
    stressPost,
    setStressPost,
    resetSession
  } = useMeditationStore();
  
  const [showStressSlider, setShowStressSlider] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [streakData, setStreakData] = useState({ count: 0, lastDate: null });
  const [stressDelta, setStressDelta] = useState<number | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Show stress slider if not already set
    if (stressPost === null) {
      setShowStressSlider(true);
    }
  }, [stressPost]);
  

  
  const handleStressSubmit = (level: number) => {
    setStressPost(level);
    setShowStressSlider(false);
    
    // Calculate and show results
    setTimeout(() => {
      if (stressPre !== null) {
        const delta = stressPre - level;
        setStressDelta(delta);
        
        // Update streak
        updateStreakData();
        
        // Show celebration after a delay
        setTimeout(() => {
          setShowCelebration(true);
        }, 500);
      }
    }, 300);
  };
  
  const handleStartAnother = () => {
    resetSession();
    router.push('/session');
  };
  
  const handleBackHome = () => {
    resetSession();
    router.push('/');
  };
  
  const getStressDeltaMessage = (delta: number) => {
    if (delta > 2) return "Excellent progress! You've made significant improvement.";
    if (delta > 0) return "Great work! You've reduced your stress level.";
    if (delta === 0) return "You maintained your calm throughout the session.";
    return "Every session is valuable. Keep practicing for better results.";
  };
  
  const getStressDeltaColor = (delta: number) => {
    if (delta > 0) return 'text-green-400';
    if (delta === 0) return 'text-[var(--accent-2)]';
    return 'text-orange-400';
  };
  
  const getStressDeltaIcon = (delta: number) => {
    if (delta > 0) return TrendingDown;
    if (delta === 0) return CheckCircle;
    return TrendingUp;
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
      <ResultsBreathingBackdrop />
      
      {/* Navigation spacer */}
      <NavBarSpacer />
      
      {/* Post-session stress slider modal */}
      {showStressSlider && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={cn(
            'bg-[var(--panel)] rounded-2xl border border-[var(--subtle)]/20 shadow-2xl',
            'max-w-md w-full p-8 transform transition-all duration-300',
            'animate-in fade-in-0 zoom-in-95'
          )}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--text)] mb-3">
                Session Complete!
              </h2>
              <p className="text-[var(--subtle)] leading-relaxed">
                How are you feeling now compared to when we started?
              </p>
            </div>
            
            <PostSessionStressSlider
              value={1}
              onChange={handleStressSubmit}
              className="mb-6"
            />
            
            <div className="text-center">
              <p className="text-xs text-[var(--subtle)]">
                This helps us track your progress over time.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main results content */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success icon */}
          <div className={cn(
            'w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-2xl transform transition-all duration-700',
            showCelebration ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          )}>
            <CheckCircle className="w-12 h-12 text-[var(--bg)]" fill="currentColor" />
          </div>
          
          {/* Title */}
          <h1 className={cn(
            'text-4xl md:text-5xl font-light text-[var(--text)] mb-6 transition-all duration-700 delay-200',
            showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}>
            Session Complete
          </h1>
          
          {/* Stress delta display */}
          {stressDelta !== null && showCelebration && (
            <div className={cn(
              'mb-8 transition-all duration-700 delay-400',
              showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            )}>
              <div className="bg-[var(--panel)] rounded-2xl border border-[var(--subtle)]/20 p-8 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  {(() => {
                    const Icon = getStressDeltaIcon(stressDelta);
                    return (
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center mr-4',
                        stressDelta > 0 ? 'bg-green-400/20' : stressDelta === 0 ? 'bg-[var(--accent-2)]/20' : 'bg-orange-400/20'
                      )}>
                        <Icon className={cn('w-6 h-6', getStressDeltaColor(stressDelta))} />
                      </div>
                    );
                  })()}
                  
                  <div className="text-left">
                    <div className="text-2xl font-semibold text-[var(--text)] mb-1">
                      {stressDelta > 0 && 'Stress '}
                      {stressDelta > 0 ? '−' : stressDelta < 0 ? '+' : ''}
                      {Math.abs(stressDelta)}
                      {stressDelta === 0 && 'Maintained Balance'}
                    </div>
                    <div className="text-sm text-[var(--subtle)]">
                      {stressPre} → {stressPost}
                    </div>
                  </div>
                </div>
                
                <p className={cn('text-lg', getStressDeltaColor(stressDelta))}>
                  {getStressDeltaMessage(stressDelta)}
                </p>
              </div>
            </div>
          )}
          
          {/* Streak badge */}
          <div className={cn(
            'mb-8 transition-all duration-700 delay-600',
            showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}>
            <DetailedStreakBadge />
          </div>
          
          {/* Action buttons */}
          <div className={cn(
            'flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-800',
            showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}>
            <StartButton
              onClick={handleStartAnother}
              glow={true}
              className="flex items-center justify-center px-8 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Another Session
            </StartButton>
            
            <LinkButton
              onClick={handleBackHome}
              className="flex items-center justify-center px-8 py-3"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </LinkButton>
          </div>
          
          {/* Encouragement message */}
          <div className={cn(
            'mt-12 transition-all duration-700 delay-1000',
            showCelebration ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}>
            <p className="text-[var(--subtle)] leading-relaxed max-w-lg mx-auto">
              Remember, every moment of mindfulness matters. You're building a practice that will serve you well.
            </p>
          </div>
        </div>
      </div>
      
      {/* Celebration particles */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-2 h-2 bg-[var(--accent)] rounded-full opacity-60',
                'animate-bounce-slow'
              )}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + i * 0.3}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}