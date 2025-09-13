'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface StressSliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  showLabels?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const stressLabels = [
  { value: 1, label: 'Very Calm', color: 'text-green-400', bgColor: 'bg-green-400/20' },
  { value: 2, label: 'Calm', color: 'text-blue-400', bgColor: 'bg-blue-400/20' },
  { value: 3, label: 'Neutral', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' },
  { value: 4, label: 'Stressed', color: 'text-orange-400', bgColor: 'bg-orange-400/20' },
  { value: 5, label: 'Very Stressed', color: 'text-red-400', bgColor: 'bg-red-400/20' }
];

export default function StressSlider({
  value,
  onChange,
  label = 'Stress Level',
  showValue = true,
  showLabels = true,
  disabled = false,
  className = '',
  size = 'md'
}: StressSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [focusedValue, setFocusedValue] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const currentStress = stressLabels.find(s => s.value === value) || stressLabels[2];
  
  const sizeClasses = {
    sm: {
      container: 'py-4',
      track: 'h-2',
      thumb: 'w-6 h-6',
      tick: 'w-3 h-3',
      label: 'text-sm',
      value: 'text-lg'
    },
    md: {
      container: 'py-6',
      track: 'h-3',
      thumb: 'w-8 h-8',
      tick: 'w-4 h-4',
      label: 'text-base',
      value: 'text-xl'
    },
    lg: {
      container: 'py-8',
      track: 'h-4',
      thumb: 'w-10 h-10',
      tick: 'w-5 h-5',
      label: 'text-lg',
      value: 'text-2xl'
    }
  };
  
  const classes = sizeClasses[size];
  
  const handleSliderClick = (event: React.MouseEvent) => {
    if (disabled || !trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(percentage * 4) + 1;
    
    onChange(Math.max(1, Math.min(5, newValue)));
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    let newValue = value;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(1, value - 1);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(5, value + 1);
        break;
      case 'Home':
        newValue = 1;
        break;
      case 'End':
        newValue = 5;
        break;
      default:
        return;
    }
    
    event.preventDefault();
    onChange(newValue);
  };
  
  const getThumbPosition = () => {
    return `${((value - 1) / 4) * 100}%`;
  };
  
  return (
    <div className={cn('w-full', classes.container, className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-4">
          <label 
            className={cn('font-medium text-[var(--text)]', classes.label)}
            id={`stress-slider-label-${Math.random().toString(36).substr(2, 9)}`}
          >
            {label}
          </label>
          {showValue && (
            <div className="flex items-center space-x-2">
              <span className={cn('font-bold', currentStress.color, classes.value)}>
                {value}
              </span>
              <span className={cn('text-[var(--subtle)]', classes.label)}>
                / 5
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className={cn(
          'relative w-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] rounded-lg',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
        role="slider"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
        aria-valuetext={currentStress.label}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocusedValue(value)}
        onBlur={() => setFocusedValue(null)}
      >
        {/* Track */}
        <div 
          ref={trackRef}
          className={cn(
            'relative w-full bg-[var(--panel)] rounded-full border border-[var(--subtle)]/20',
            classes.track
          )}
          onClick={handleSliderClick}
        >
          {/* Progress Fill */}
          <div 
            className={cn(
              'absolute left-0 top-0 h-full rounded-full transition-all duration-200',
              currentStress.bgColor
            )}
            style={{ width: getThumbPosition() }}
          />
          
          {/* Tick Marks */}
          {stressLabels.map((stress, index) => {
            const position = (index / 4) * 100;
            const isActive = stress.value <= value;
            const isFocused = focusedValue === stress.value;
            
            return (
              <div
                key={stress.value}
                className={cn(
                  'absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-all duration-200',
                  classes.tick,
                  isActive 
                    ? `${stress.color.replace('text-', 'bg-')} border-current shadow-sm` 
                    : 'bg-[var(--panel)] border-[var(--subtle)]/40',
                  isFocused && 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg)]',
                  !disabled && 'hover:scale-110'
                )}
                style={{ left: `${position}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!disabled) onChange(stress.value);
                }}
              />
            );
          })}
          
          {/* Thumb */}
          <div
            className={cn(
              'absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border-3 border-[var(--bg)] shadow-lg transition-all duration-200',
              classes.thumb,
              currentStress.color.replace('text-', 'bg-'),
              !disabled && 'hover:scale-110 active:scale-95',
              isDragging && 'scale-110',
              focusedValue === value && 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg)]'
            )}
            style={{ left: getThumbPosition() }}
          />
        </div>
      </div>
      
      {/* Labels - Removed preset buttons, keeping only visual labels if needed */}
      {showLabels && (
        <div className="flex justify-between mt-4 px-1">
          {stressLabels.map((stress) => (
            <div
              key={stress.value}
              className={cn(
                'text-center transition-all duration-200 px-2 py-1',
                classes.label,
                stress.value === value 
                  ? `${stress.color} font-semibold` 
                  : 'text-[var(--subtle)]'
              )}
            >
              <div className="text-xs font-medium">{stress.value}</div>
              <div className="text-xs opacity-80">{stress.label}</div>
            </div>
          ))}
        </div>
      )}
      
      {/* Current Selection Display */}
      {showValue && (
        <div className="mt-4 text-center">
          <div className={cn(
            'inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200',
            currentStress.bgColor,
            'border-current/20'
          )}>
            <div className={cn('w-3 h-3 rounded-full', currentStress.color.replace('text-', 'bg-'))} />
            <span className={cn('font-medium', currentStress.color)}>
              {currentStress.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized components for different contexts
export function PreSessionStressSlider(props: Omit<StressSliderProps, 'label'>) {
  return (
    <StressSlider
      label="How stressed are you right now?"
      {...props}
    />
  );
}

export function PostSessionStressSlider(props: Omit<StressSliderProps, 'label'>) {
  return (
    <StressSlider
      label="How do you feel now?"
      {...props}
    />
  );
}