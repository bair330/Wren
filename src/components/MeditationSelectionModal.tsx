'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Timer, Wind, Volume2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeditationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MeditationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const meditationOptions: MeditationOption[] = [
  {
    id: 'timer',
    title: 'Meditation Timer',
    description: 'Set a custom timer for your meditation practice with session tracking',
    icon: <Timer className="w-6 h-6" />,
    route: '/dashboard?tab=timer',
    color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
  },
  {
    id: 'breathing',
    title: 'Breathing Exercise',
    description: 'Follow guided breathing patterns with visual animations',
    icon: <Wind className="w-6 h-6" />,
    route: '/dashboard?tab=breathing',
    color: 'from-green-500/20 to-green-600/20 border-green-500/30'
  },
  {
    id: 'audio',
    title: 'Audio Meditation',
    description: 'Listen to calming sounds and meditation music',
    icon: <Volume2 className="w-6 h-6" />,
    route: '/dashboard?tab=audio',
    color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30'
  }
];

export function MeditationSelectionModal({ isOpen, onClose }: MeditationSelectionModalProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: MeditationOption) => {
    setSelectedOption(option.id);
    // Add a small delay for visual feedback
    setTimeout(() => {
      router.push(option.route);
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[var(--panel)] border border-[var(--subtle)]/20 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[var(--subtle)]/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[var(--text)]">
              Choose Your Practice
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--subtle)]/10 transition-colors"
            >
              <X className="w-5 h-5 text-[var(--subtle)]" />
            </button>
          </div>
          <p className="text-[var(--subtle)] mt-2">
            Select the type of meditation that resonates with you today
          </p>
        </div>
        
        {/* Options */}
        <div className="p-6 space-y-4">
          {meditationOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={cn(
                'w-full p-4 rounded-xl border transition-all duration-200 text-left group',
                'hover:scale-[1.02] hover:shadow-lg',
                selectedOption === option.id 
                  ? 'scale-[0.98] opacity-80' 
                  : 'hover:border-[var(--accent)]/30',
                `bg-gradient-to-r ${option.color}`
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-[var(--bg)]/50 text-[var(--text)]">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-sm text-[var(--subtle)] mt-1 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-6 pt-0">
          <p className="text-xs text-[var(--subtle)] text-center">
            You can switch between practices anytime from the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}