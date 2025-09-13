'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import MessageList, { Message } from './MessageList';
import ChatInput from './ChatInput';
import { BreathingIndicator } from './BreathingBackdrop';
import { NextStepButton } from './GlowButton';

interface ChatShellProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onNextStep?: () => void;
  loading?: boolean;
  showNextStep?: boolean;
  nextStepText?: string;
  className?: string;
  headerTitle?: string;
  headerSubtitle?: string;
}

export default function ChatShell({
  messages,
  onSendMessage,
  onNextStep,
  loading = false,
  showNextStep = false,
  nextStepText = 'Next Step',
  className = '',
  headerTitle = 'Wren',
  headerSubtitle = 'Your meditation guide'
}: ChatShellProps) {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleKeyboardShortcut = (e: KeyboardEvent) => {
    if (e.key === 'n' || e.key === 'N') {
      if (showNextStep && onNextStep && !loading) {
        e.preventDefault();
        onNextStep();
      }
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [showNextStep, onNextStep, loading]);
  
  return (
    <div className={cn(
      'flex flex-col h-full bg-[var(--bg)] relative overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="flex-shrink-0 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--subtle)]/20 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Avatar and Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-[var(--bg)]" fill="currentColor" />
                </div>
                
                {/* Online status indicator */}
                <div className={cn(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[var(--bg)] transition-colors duration-200',
                  isOnline ? 'bg-green-400' : 'bg-red-400'
                )} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-semibold text-[var(--text)]">
                    {headerTitle}
                  </h1>
                  <BreathingIndicator size="sm" />
                </div>
                <p className="text-sm text-[var(--subtle)]">
                  {headerSubtitle}
                </p>
              </div>
            </div>
            
            {/* Status and Actions */}
            <div className="flex items-center space-x-3">
              {/* Connection status */}
              <div className={cn(
                'px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200',
                isOnline 
                  ? 'bg-green-400/20 text-green-400' 
                  : 'bg-red-400/20 text-red-400'
              )}>
                {isOnline ? 'Online' : 'Offline'}
              </div>
              
              {/* Next Step Button */}
              {showNextStep && onNextStep && (
                <NextStepButton
                  onClick={onNextStep}
                  disabled={loading}
                  className="hidden sm:inline-flex"
                >
                  {nextStepText}
                </NextStepButton>
              )}
            </div>
          </div>
          
          {/* Mobile Next Step Button */}
          {showNextStep && onNextStep && (
            <div className="sm:hidden mt-3">
              <NextStepButton
                onClick={onNextStep}
                disabled={loading}
                className="w-full"
              >
                {nextStepText}
              </NextStepButton>
            </div>
          )}
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 relative overflow-hidden">
        <MessageList
          messages={messages}
          className="h-full"
          autoScroll={true}
          showTimestamps={true}
          showAvatars={true}
        />
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-[var(--bg)]/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center space-x-3 px-6 py-3 rounded-lg bg-[var(--panel)] border border-[var(--subtle)]/20 shadow-lg">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="text-[var(--text)] font-medium ml-2">Wren is thinking...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="flex-shrink-0">
        <ChatInput
          onSend={onSendMessage}
          loading={loading}
          disabled={loading}
          placeholder={showNextStep ? "Share your thoughts or click 'Next Step' to continue..." : "Share your thoughts or feelings..."}
          autoFocus={false}
        />
      </div>
      
      {/* Keyboard shortcut hint */}
      {showNextStep && onNextStep && (
        <div className="absolute bottom-20 left-4 hidden lg:block">
          <div className="px-3 py-2 rounded-lg bg-[var(--panel)]/80 backdrop-blur-sm border border-[var(--subtle)]/20 text-xs text-[var(--subtle)]">
            Press <kbd className="px-1.5 py-0.5 bg-[var(--subtle)]/20 rounded text-[var(--text)] font-mono">N</kbd> for next step
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized chat shells for different contexts
export function SessionChatShell(props: Omit<ChatShellProps, 'headerTitle' | 'headerSubtitle'>) {
  return (
    <ChatShell
      headerTitle="Wren"
      headerSubtitle="Your meditation guide"
      {...props}
    />
  );
}

export function GuidedChatShell(props: Omit<ChatShellProps, 'headerTitle' | 'headerSubtitle' | 'showNextStep'>) {
  return (
    <ChatShell
      headerTitle="Wren"
      headerSubtitle="Guiding your meditation"
      showNextStep={true}
      {...props}
    />
  );
}