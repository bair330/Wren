'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  pulse?: boolean;
  className?: string;
}

export default function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  glow = true,
  pulse = false,
  className = '',
  disabled = false,
  ...props
}: GlowButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-[var(--bg)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-[var(--panel)] text-[var(--text)] border border-[var(--subtle)]/30 hover:border-[var(--accent)]/50 hover:bg-[var(--panel)]/80',
    ghost: 'text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent-2)]'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const glowClasses = glow && variant === 'primary' && !disabled
    ? 'shadow-[0_0_20px_rgba(110,231,183,0.3)] hover:shadow-[0_0_30px_rgba(110,231,183,0.5)]'
    : '';
  
  const pulseClasses = pulse && !disabled
    ? 'animate-pulse-glow'
    : '';
  
  const combinedClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    glowClasses,
    pulseClasses,
    className
  );
  
  return (
    <button
      className={combinedClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Specialized components for common use cases
export function StartButton(props: Omit<GlowButtonProps, 'variant' | 'size' | 'pulse'>) {
  return (
    <GlowButton
      variant="primary"
      size="lg"
      pulse={true}
      {...props}
    >
      {props.children}
    </GlowButton>
  );
}

export function NextStepButton(props: Omit<GlowButtonProps, 'variant' | 'size'>) {
  return (
    <GlowButton
      variant="secondary"
      size="md"
      {...props}
    >
      {props.children}
    </GlowButton>
  );
}

export function LinkButton(props: Omit<GlowButtonProps, 'variant'>) {
  return (
    <GlowButton
      variant="ghost"
      glow={false}
      {...props}
    >
      {props.children}
    </GlowButton>
  );
}