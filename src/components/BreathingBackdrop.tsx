'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface BreathingBackdropProps {
  variant?: 'subtle' | 'prominent' | 'rings' | 'gradient';
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  children?: React.ReactNode;
}

export default function BreathingBackdrop({
  variant = 'subtle',
  intensity = 'low',
  speed = 'slow',
  className = '',
  children
}: BreathingBackdropProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const speedClasses = {
    slow: 'animate-breathe-slow',
    normal: 'animate-breathe',
    fast: 'animate-breathe-fast'
  };
  
  const intensityOpacity = {
    low: 'opacity-20',
    medium: 'opacity-30',
    high: 'opacity-40'
  };
  
  if (prefersReducedMotion) {
    return (
      <div className={cn('relative', className)}>
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-radial from-[var(--accent)]/5 via-transparent to-transparent" />
        )}
        {children}
      </div>
    );
  }
  
  const renderSubtleVariant = () => (
    <div className={cn('relative overflow-hidden', className)}>
      <div className={cn(
        'absolute inset-0 bg-gradient-radial from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent',
        speedClasses[speed],
        intensityOpacity[intensity]
      )} />
      {children}
    </div>
  );
  
  const renderProminentVariant = () => (
    <div className={cn('relative overflow-hidden', className)}>
      <div className={cn(
        'absolute inset-0 bg-gradient-radial from-[var(--accent)]/20 via-[var(--accent-2)]/10 to-transparent',
        speedClasses[speed],
        intensityOpacity[intensity]
      )} />
      <div className={cn(
        'absolute inset-0 bg-gradient-radial from-transparent via-[var(--accent-2)]/5 to-[var(--accent)]/10',
        speedClasses[speed === 'slow' ? 'normal' : speed === 'normal' ? 'fast' : 'slow'],
        intensityOpacity[intensity]
      )} />
      {children}
    </div>
  );
  
  const renderRingsVariant = () => (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Outer ring */}
      <div className={cn(
        'absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)]/20',
        speedClasses[speed],
        intensityOpacity[intensity]
      )} />
      
      {/* Middle ring */}
      <div className={cn(
        'absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent-2)]/30',
        speedClasses[speed === 'slow' ? 'normal' : speed === 'normal' ? 'fast' : 'slow'],
        intensityOpacity[intensity]
      )} />
      
      {/* Inner ring */}
      <div className={cn(
        'absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)]/40',
        speedClasses[speed === 'slow' ? 'fast' : speed === 'normal' ? 'slow' : 'normal'],
        intensityOpacity[intensity]
      )} />
      
      {/* Center glow */}
      <div className={cn(
        'absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-[var(--accent)]/30 to-transparent',
        speedClasses[speed],
        intensityOpacity[intensity]
      )} />
      
      {children}
    </div>
  );
  
  const renderGradientVariant = () => (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Primary gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-radial from-[var(--accent)]/15 via-[var(--accent-2)]/8 to-transparent',
        speedClasses[speed],
        intensityOpacity[intensity]
      )} />
      
      {/* Secondary gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-conic from-[var(--accent)]/10 via-transparent to-[var(--accent-2)]/10',
        speedClasses[speed === 'slow' ? 'normal' : speed === 'normal' ? 'fast' : 'slow'],
        intensityOpacity[intensity]
      )} />
      
      {/* Tertiary gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-linear from-transparent via-[var(--accent)]/5 to-transparent',
        speedClasses[speed === 'slow' ? 'fast' : speed === 'normal' ? 'slow' : 'normal'],
        intensityOpacity[intensity]
      )} />
      
      {children}
    </div>
  );
  
  switch (variant) {
    case 'prominent':
      return renderProminentVariant();
    case 'rings':
      return renderRingsVariant();
    case 'gradient':
      return renderGradientVariant();
    case 'subtle':
    default:
      return renderSubtleVariant();
  }
}

// Specialized components for different contexts
export function SessionBreathingBackdrop(props: Omit<BreathingBackdropProps, 'variant' | 'intensity'>) {
  return (
    <BreathingBackdrop
      variant="rings"
      intensity="low"
      {...props}
    />
  );
}

export function LandingBreathingBackdrop(props: Omit<BreathingBackdropProps, 'variant' | 'intensity'>) {
  return (
    <BreathingBackdrop
      variant="gradient"
      intensity="medium"
      {...props}
    />
  );
}

export function ResultsBreathingBackdrop(props: Omit<BreathingBackdropProps, 'variant' | 'intensity'>) {
  return (
    <BreathingBackdrop
      variant="subtle"
      intensity="low"
      {...props}
    />
  );
}

// Breathing indicator component for chat header
export function BreathingIndicator({ 
  className = '',
  size = 'sm'
}: { 
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const sizeClasses = {
    xs: 'space-x-1',
    sm: 'space-x-1.5',
    md: 'space-x-2'
  };
  
  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2'
  };
  
  return (
    <div className={cn('flex items-center', sizeClasses[size], className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'rounded-full bg-[var(--accent)] transition-all duration-200',
            dotSizes[size],
            !prefersReducedMotion && 'animate-breathe-dots'
          )}
          style={{
            animationDelay: !prefersReducedMotion ? `${index * 0.2}s` : '0s'
          }}
        />
      ))}
    </div>
  );
}