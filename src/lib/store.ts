'use client';

import { create } from 'zustand';
import { updateCurrentSession, clearCurrentSession } from './storage';

// Session data interface
export interface SessionData {
  stressPre: number;
  stressPost: number;
  duration: number;
  completedAt: string;
}

// Message interface
export interface Message {
  id: string;
  role: 'wren' | 'user';
  text: string;
  timestamp: Date;
}

// Session states
export type SessionState = 'idle' | 'intro' | 'breathing' | 'guidance' | 'complete';

// Store interface
interface MeditationStore {
  // Session state
  sessionState: SessionState;
  messages: Message[];
  stressPre: number | null;
  stressPost: number | null;
  sessionStartTime: Date | null;
  
  // Actions
  setSessionState: (state: SessionState) => void;
  addMessage: (role: 'wren' | 'user', text: string) => void;
  clearMessages: () => void;
  setStressPre: (level: number) => void;
  setStressPost: (level: number) => void;
  startSession: () => void;
  completeSession: () => SessionData;
  resetSession: () => void;
  
  // Scripted flow helpers
  advanceToNextStep: () => void;
  getCurrentStepMessage: () => string;
}

// Scripted messages for demo flow
const SCRIPTED_MESSAGES = {
  intro: "Hello! I'm Wren, your meditation guide. Let's begin with a gentle breathing exercise. Take a moment to get comfortable.",
  breathing: "Perfect. Now, let's focus on your breath. Breathe in slowly for 4 counts... hold for 4... and breathe out for 6. Feel your body relaxing with each exhale.",
  guidance: "Wonderful. As you continue breathing, imagine a warm, calming light surrounding you. This light represents peace and tranquility. Let it wash away any tension or stress.",
  complete: "You've done beautifully. Take a moment to notice how you feel right now. When you're ready, we'll wrap up this session."
};

// Create the store
export const useMeditationStore = create<MeditationStore>((set, get) => ({
  // Initial state
  sessionState: 'idle',
  messages: [],
  stressPre: null,
  stressPost: null,
  sessionStartTime: null,
  
  // Actions
  setSessionState: (state) => {
    set({ sessionState: state });
    
    // Auto-add Wren message when transitioning to certain states
    if (state === 'intro' || state === 'breathing' || state === 'guidance') {
      const message = SCRIPTED_MESSAGES[state];
      get().addMessage('wren', message);
    }
  },
  
  addMessage: (role, text) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      text,
      timestamp: new Date()
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },
  
  clearMessages: () => set({ messages: [] }),
  
  setStressPre: (level) => {
    set({ stressPre: level });
    updateCurrentSession({ stressPre: level });
  },
  
  setStressPost: (level) => {
    set({ stressPost: level });
    updateCurrentSession({ stressPost: level });
  },
  
  startSession: () => {
    const startTime = new Date();
    set({ 
      sessionStartTime: startTime,
      sessionState: 'intro',
      messages: []
    });
    
    updateCurrentSession({ 
      duration: 0,
      completedAt: startTime.toISOString()
    });
  },
  
  completeSession: () => {
    const state = get();
    const endTime = new Date();
    const duration = state.sessionStartTime 
      ? Math.floor((endTime.getTime() - state.sessionStartTime.getTime()) / 1000)
      : 0;
    
    const sessionData: SessionData = {
      stressPre: state.stressPre || 3,
      stressPost: state.stressPost || 2,
      duration,
      completedAt: endTime.toISOString()
    };
    
    set({ sessionState: 'complete' });
    clearCurrentSession();
    
    return sessionData;
  },
  
  resetSession: () => {
    set({
      sessionState: 'idle',
      messages: [],
      stressPre: null,
      stressPost: null,
      sessionStartTime: null
    });
    clearCurrentSession();
  },
  
  // Scripted flow helpers
  advanceToNextStep: () => {
    const currentState = get().sessionState;
    
    switch (currentState) {
      case 'idle':
        get().setSessionState('intro');
        break;
      case 'intro':
        get().setSessionState('breathing');
        break;
      case 'breathing':
        get().setSessionState('guidance');
        break;
      case 'guidance':
        get().setSessionState('complete');
        break;
      default:
        break;
    }
  },
  
  getCurrentStepMessage: () => {
    const state = get().sessionState;
    return SCRIPTED_MESSAGES[state as keyof typeof SCRIPTED_MESSAGES] || '';
  }
}));

// Selector hooks for better performance
export const useSessionState = () => useMeditationStore((state) => state.sessionState);
export const useMessages = () => useMeditationStore((state) => state.messages);
export const useStressLevels = () => useMeditationStore((state) => ({
  pre: state.stressPre,
  post: state.stressPost
}));

// Helper function to get stress level description
export function getStressDescription(level: number): string {
  const descriptions = {
    1: 'Very Calm',
    2: 'Relaxed', 
    3: 'Neutral',
    4: 'Stressed',
    5: 'Very Stressed'
  };
  
  return descriptions[level as keyof typeof descriptions] || 'Unknown';
}

// Helper function to get stress level color
export function getStressColor(level: number): string {
  const colors = {
    1: 'var(--accent)',     // mint - very calm
    2: 'var(--accent-2)',   // soft blue - relaxed
    3: 'var(--subtle)',     // neutral gray
    4: '#F59E0B',           // amber - stressed
    5: '#EF4444'            // red - very stressed
  };
  
  return colors[level as keyof typeof colors] || 'var(--subtle)';
}