'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  role: 'wren' | 'user';
  text: string;
  timestamp: Date;
  type?: 'message' | 'system' | 'guidance';
}

interface MessageListProps {
  messages: Message[];
  className?: string;
  autoScroll?: boolean;
  showTimestamps?: boolean;
  showAvatars?: boolean;
}

export default function MessageList({
  messages,
  className = '',
  autoScroll = true,
  showTimestamps = true,
  showAvatars = true
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, autoScroll, shouldAutoScroll]);
  
  // Check if user is near bottom to determine auto-scroll behavior
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const nearBottom = distanceFromBottom < 100;
      
      setIsNearBottom(nearBottom);
      setShouldAutoScroll(nearBottom);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };
  
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };
  
  const renderMessage = (message: Message, index: number) => {
    const isWren = message.role === 'wren';
    const isSystem = message.type === 'system';
    const isGuidance = message.type === 'guidance';
    const prevMessage = messages[index - 1];
    const nextMessage = messages[index + 1];
    
    const showAvatar = showAvatars && (
      !prevMessage || 
      prevMessage.role !== message.role ||
      (message.timestamp.getTime() - prevMessage.timestamp.getTime()) > 300000 // 5 minutes
    );
    
    const showTimestamp = showTimestamps && (
      !nextMessage ||
      nextMessage.role !== message.role ||
      (nextMessage.timestamp.getTime() - message.timestamp.getTime()) > 300000 // 5 minutes
    );
    
    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <div className="px-3 py-1 rounded-full bg-[var(--subtle)]/10 text-[var(--subtle)] text-sm">
            {message.text}
          </div>
        </div>
      );
    }
    
    return (
      <div
        key={message.id}
        className={cn(
          'flex items-end space-x-3 mb-4 animate-fade-in',
          isWren ? 'justify-start' : 'justify-end'
        )}
      >
        {/* Avatar (Wren side) */}
        {isWren && showAvatar && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-[var(--bg)]" fill="currentColor" />
          </div>
        )}
        
        {/* Spacer when no avatar */}
        {isWren && !showAvatar && <div className="w-8" />}
        
        {/* Message bubble */}
        <div className={cn(
          'max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl',
          isWren ? 'order-2' : 'order-1'
        )}>
          <div className={cn(
            'px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md',
            isWren
              ? cn(
                  'bg-[var(--panel)] text-[var(--text)] border border-[var(--accent)]/20',
                  isGuidance && 'border-[var(--accent-2)]/30 bg-gradient-to-br from-[var(--panel)] to-[var(--accent)]/5'
                )
              : 'bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-2)]/10 text-[var(--text)] border border-[var(--accent)]/20',
            isWren ? 'rounded-bl-md' : 'rounded-br-md'
          )}>
            {/* Message content */}
            <div className={cn(
              'text-sm leading-relaxed whitespace-pre-wrap break-words',
              isGuidance && 'font-medium'
            )}>
              {message.text}
            </div>
            
            {/* Timestamp */}
            {showTimestamp && (
              <div className={cn(
                'mt-2 text-xs opacity-60',
                isWren ? 'text-[var(--subtle)]' : 'text-[var(--text)]'
              )}>
                {formatTime(message.timestamp)}
              </div>
            )}
          </div>
          
          {/* Relative timestamp */}
          {showTimestamp && (
            <div className={cn(
              'mt-1 text-xs text-[var(--subtle)] px-1',
              isWren ? 'text-left' : 'text-right'
            )}>
              {formatRelativeTime(message.timestamp)}
            </div>
          )}
        </div>
        
        {/* Avatar (User side) */}
        {!isWren && showAvatar && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--subtle)]/20 flex items-center justify-center">
            <User className="w-4 h-4 text-[var(--subtle)]" />
          </div>
        )}
        
        {/* Spacer when no avatar */}
        {!isWren && !showAvatar && <div className="w-8" />}
      </div>
    );
  };
  
  if (messages.length === 0) {
    return (
      <div className={cn(
        'flex-1 flex items-center justify-center p-8',
        className
      )}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center">
            <Heart className="w-8 h-8 text-[var(--bg)]" fill="currentColor" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
            Welcome to your meditation session
          </h3>
          <p className="text-[var(--subtle)] max-w-md">
            I'm Wren, your meditation guide. Let's begin this peaceful journey together.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn('flex flex-col', className)}>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin scrollbar-thumb-[var(--subtle)]/20 scrollbar-track-transparent"
      >
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to bottom button */}
      {!isNearBottom && messages.length > 0 && (
        <div className="absolute bottom-20 right-6">
          <button
            onClick={() => {
              setShouldAutoScroll(true);
              messagesEndRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'end'
              });
            }}
            className="w-10 h-10 rounded-full bg-[var(--panel)] border border-[var(--subtle)]/20 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-[var(--accent)] hover:scale-105 active:scale-95"
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to create messages
export function createMessage(
  role: 'wren' | 'user',
  text: string,
  type: 'message' | 'system' | 'guidance' = 'message'
): Message {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role,
    text,
    timestamp: new Date(),
    type
  };
}

// Helper function to create system messages
export function createSystemMessage(text: string): Message {
  return createMessage('wren', text, 'system');
}

// Helper function to create guidance messages
export function createGuidanceMessage(text: string): Message {
  return createMessage('wren', text, 'guidance');
}