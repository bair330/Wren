'use client';

import { useEffect, useState } from 'react';
import { Flame, Calendar, Trophy, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStreakData } from '@/lib/storage';

interface StreakBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  showAnimation?: boolean;
}

export default function StreakBadge({
  className = '',
  size = 'md',
  variant = 'default',
  showAnimation = true
}: StreakBadgeProps) {
  const [streakData, setStreakData] = useState({ count: 0, lastCompletedDate: null, totalSessions: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [justUpdated, setJustUpdated] = useState(false);
  
  useEffect(() => {
    const loadStreakData = () => {
      const data = getStreakData();
      setStreakData(data);
      setIsLoading(false);
    };
    
    loadStreakData();
    
    // Listen for storage changes to update streak in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wren_streak_count' || e.key === 'wren_last_completed_date') {
        loadStreakData();
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 2000);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const sizeClasses = {
    sm: {
      container: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      number: 'text-lg font-bold',
      label: 'text-xs'
    },
    md: {
      container: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      number: 'text-xl font-bold',
      label: 'text-sm'
    },
    lg: {
      container: 'px-6 py-4 text-lg',
      icon: 'w-6 h-6',
      number: 'text-2xl font-bold',
      label: 'text-base'
    }
  };
  
  const classes = sizeClasses[size];
  
  const getStreakLevel = (count: number) => {
    if (count >= 30) return { level: 'legendary', color: 'text-purple-400', bgColor: 'bg-purple-400/20', icon: Trophy };
    if (count >= 14) return { level: 'master', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', icon: Star };
    if (count >= 7) return { level: 'committed', color: 'text-blue-400', bgColor: 'bg-blue-400/20', icon: Calendar };
    if (count >= 3) return { level: 'building', color: 'text-green-400', bgColor: 'bg-green-400/20', icon: Flame };
    return { level: 'starting', color: 'text-[var(--accent)]', bgColor: 'bg-[var(--accent)]/20', icon: Flame };
  };
  
  const streakLevel = getStreakLevel(streakData.count);
  const IconComponent = streakLevel.icon;
  
  const getStreakMessage = (count: number) => {
    if (count === 0) return 'Start your journey';
    if (count === 1) return 'Great start!';
    if (count < 7) return 'Building momentum';
    if (count < 14) return 'Staying consistent';
    if (count < 30) return 'Meditation master';
    return 'Legendary streak!';
  };
  
  if (isLoading) {
    return (
      <div className={cn(
        'inline-flex items-center space-x-2 rounded-lg border border-[var(--subtle)]/20 bg-[var(--panel)] animate-pulse',
        classes.container,
        className
      )}>
        <div className={cn('rounded-full bg-[var(--subtle)]/20', classes.icon)} />
        <div className="space-y-1">
          <div className="h-4 w-12 bg-[var(--subtle)]/20 rounded" />
          <div className="h-3 w-16 bg-[var(--subtle)]/20 rounded" />
        </div>
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={cn(
        'inline-flex items-center space-x-2 rounded-full border transition-all duration-200',
        streakLevel.bgColor,
        'border-current/20',
        classes.container,
        showAnimation && justUpdated && 'animate-bounce',
        className
      )}>
        <IconComponent className={cn(classes.icon, streakLevel.color)} />
        <span className={cn('font-bold', streakLevel.color)}>
          {streakData.count}
        </span>
      </div>
    );
  }
  
  if (variant === 'detailed') {
    return (
      <div className={cn(
        'rounded-lg border border-[var(--subtle)]/20 bg-[var(--panel)] p-6 transition-all duration-200',
        showAnimation && justUpdated && 'scale-105 shadow-lg',
        className
      )}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-lg transition-all duration-200',
              streakLevel.bgColor
            )}>
              <IconComponent className={cn('w-6 h-6', streakLevel.color)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)]">
                Meditation Streak
              </h3>
              <p className={cn('text-sm', streakLevel.color)}>
                {getStreakMessage(streakData.count)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn('text-3xl font-bold', streakLevel.color)}>
              {streakData.count}
            </div>
            <div className="text-sm text-[var(--subtle)]">
              {streakData.count === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
        
        {streakData.lastCompletedDate && (
          <div className="text-xs text-[var(--subtle)] border-t border-[var(--subtle)]/20 pt-3">
            Last session: {new Date(streakData.lastCompletedDate).toLocaleDateString()}
          </div>
        )}
        
        {/* Progress to next milestone */}
        {streakData.count < 30 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--subtle)] mb-1">
              <span>Next milestone</span>
              <span>
                {streakData.count < 3 ? '3 days' :
                 streakData.count < 7 ? '7 days' :
                 streakData.count < 14 ? '14 days' : '30 days'}
              </span>
            </div>
            <div className="w-full bg-[var(--subtle)]/20 rounded-full h-2">
              <div 
                className={cn(
                  'h-2 rounded-full transition-all duration-500',
                  streakLevel.color.replace('text-', 'bg-')
                )}
                style={{
                  width: `${(
                    streakData.count / 
                    (streakData.count < 3 ? 3 :
                     streakData.count < 7 ? 7 :
                     streakData.count < 14 ? 14 : 30)
                  ) * 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={cn(
      'inline-flex items-center space-x-3 rounded-lg border border-[var(--subtle)]/20 bg-[var(--panel)] transition-all duration-200 hover:bg-[var(--panel)]/80',
      classes.container,
      showAnimation && justUpdated && 'animate-pulse',
      className
    )}>
      <div className={cn(
        'p-2 rounded-lg transition-all duration-200',
        streakLevel.bgColor
      )}>
        <IconComponent className={cn(classes.icon, streakLevel.color)} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <span className={cn(classes.number, streakLevel.color)}>
            {streakData.count}
          </span>
          <span className={cn(classes.label, 'text-[var(--subtle)]')}>
            {streakData.count === 1 ? 'day streak' : 'day streak'}
          </span>
        </div>
        <div className={cn(classes.label, 'text-[var(--subtle)] mt-1')}>
          {getStreakMessage(streakData.count)}
        </div>
      </div>
    </div>
  );
}

// Specialized components for different contexts
export function CompactStreakBadge(props: Omit<StreakBadgeProps, 'variant'>) {
  return <StreakBadge variant="compact" {...props} />;
}

export function DetailedStreakBadge(props: Omit<StreakBadgeProps, 'variant'>) {
  return <StreakBadge variant="detailed" {...props} />;
}

export function HeaderStreakBadge(props: Omit<StreakBadgeProps, 'variant' | 'size'>) {
  return <StreakBadge variant="compact" size="sm" {...props} />;
}