'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Plus } from 'lucide-react';

interface MeditationTimerProps {
  onSessionComplete?: () => void;
  onTimerStart?: () => void;
  onTimerStop?: () => void;
}

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

const PRESET_DURATIONS = [
  { label: '5 min', value: 5 * 60 },
  { label: '10 min', value: 10 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: '20 min', value: 20 * 60 },
  { label: '30 min', value: 30 * 60 },
];

export default function MeditationTimer({
  onSessionComplete,
  onTimerStart,
  onTimerStop
}: MeditationTimerProps) {
  const [duration, setDuration] = useState(10 * 60); // Default 10 minutes
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio for completion notification
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    };
    
    audioRef.current = { play: createBeepSound } as any;
  }, []);

  // Timer logic
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerState('completed');
            onSessionComplete?.();
            // Play completion sound
            try {
              audioRef.current?.play();
            } catch (error) {
              console.log('Audio play failed:', error);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState, onSessionComplete]);

  // Update time remaining when duration changes
  useEffect(() => {
    if (timerState === 'idle') {
      setTimeRemaining(duration);
    }
  }, [duration, timerState]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return ((duration - timeRemaining) / duration) * 100;
  };

  const handleStart = () => {
    setTimerState('running');
    onTimerStart?.();
  };

  const handlePause = () => {
    setTimerState('paused');
  };

  const handleStop = () => {
    setTimerState('idle');
    setTimeRemaining(duration);
    onTimerStop?.();
  };

  const handleReset = () => {
    setTimerState('idle');
    setTimeRemaining(duration);
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    setTimeRemaining(newDuration);
    setTimerState('idle');
    setShowCustomInput(false);
  };

  const handleCustomDuration = () => {
    const minutes = parseInt(customDuration);
    if (minutes > 0 && minutes <= 120) {
      handleDurationChange(minutes * 60);
      setCustomDuration('');
    }
  };

  const handleExtendSession = (additionalMinutes: number) => {
    const newDuration = duration + (additionalMinutes * 60);
    setDuration(newDuration);
    setTimeRemaining(timeRemaining + (additionalMinutes * 60));
    setTimerState('running');
  };

  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (getProgress() / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      {/* Duration Selection */}
      {timerState === 'idle' && (
        <div className="w-full max-w-md space-y-4">
          <h3 className="text-lg font-medium text-[var(--accent)] text-center mb-4">
            Choose Session Duration
          </h3>
          
          {/* Preset Durations */}
          <div className="grid grid-cols-3 gap-2">
            {PRESET_DURATIONS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleDurationChange(preset.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  duration === preset.value
                    ? 'bg-[var(--accent)] text-[var(--bg)]'
                    : 'bg-[var(--panel)] text-[var(--subtle)] hover:bg-[var(--panel)]/80 hover:text-[var(--text)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          {/* Custom Duration */}
          <div className="flex items-center space-x-2">
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--panel)] text-[var(--subtle)] rounded-lg hover:bg-[var(--panel)]/80 hover:text-[var(--text)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Custom</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 w-full">
                <input
                  type="number"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="Minutes (1-120)"
                  min="1"
                  max="120"
                  className="flex-1 px-3 py-2 bg-[var(--panel)] text-[var(--text)] rounded-lg border border-[var(--subtle)]/30 focus:border-[var(--accent)] focus:outline-none"
                />
                <button
                  onClick={handleCustomDuration}
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded-lg hover:bg-[var(--accent)]/80 transition-colors"
                >
                  Set
                </button>
                <button
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomDuration('');
                  }}
                  className="px-4 py-2 bg-[var(--subtle)]/20 text-[var(--text)] rounded-lg hover:bg-[var(--subtle)]/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Circular Progress Timer */}
      <div className="relative">
        <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="var(--subtle)"
            strokeOpacity="0.3"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="var(--accent)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-light text-[var(--text)] mb-2">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-[var(--subtle)]">
            {timerState === 'idle' && 'Ready to start'}
            {timerState === 'running' && 'Meditating...'}
            {timerState === 'paused' && 'Paused'}
            {timerState === 'completed' && 'Session Complete!'}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {timerState === 'idle' && (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-lg hover:bg-[var(--accent)]/80 transition-colors font-medium"
          >
            <Play className="w-5 h-5" />
            <span>Start Session</span>
          </button>
        )}
        
        {timerState === 'running' && (
          <>
            <button
              onClick={handlePause}
              className="flex items-center space-x-2 px-6 py-3 bg-[var(--accent-2)] text-[var(--bg)] rounded-lg hover:bg-[var(--accent-2)]/80 transition-colors font-medium"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
            <button
              onClick={handleStop}
              className="flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </>
        )}
        
        {timerState === 'paused' && (
          <>
            <button
              onClick={handleStart}
              className="flex items-center space-x-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-lg hover:bg-[var(--accent)]/80 transition-colors font-medium"
            >
              <Play className="w-5 h-5" />
              <span>Resume</span>
            </button>
            <button
              onClick={handleStop}
              className="flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </>
        )}
        
        {timerState === 'completed' && (
          <>
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-lg hover:bg-[var(--accent)]/80 transition-colors font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              <span>New Session</span>
            </button>
          </>
        )}
      </div>

      {/* Session Extension (when completed) */}
      {timerState === 'completed' && (
        <div className="flex flex-col items-center space-y-3">
          <p className="text-[var(--subtle)] text-sm">Want to continue?</p>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExtendSession(5)}
              className="px-4 py-2 bg-[var(--panel)] text-[var(--subtle)] rounded-lg hover:bg-[var(--panel)]/80 hover:text-[var(--text)] transition-colors text-sm"
            >
              +5 min
            </button>
            <button
              onClick={() => handleExtendSession(10)}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              +10 min
            </button>
            <button
              onClick={() => handleExtendSession(15)}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              +15 min
            </button>
          </div>
        </div>
      )}
    </div>
  );
}