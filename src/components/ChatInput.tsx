'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxLength?: number;
  className?: string;
  autoFocus?: boolean;
}

export default function ChatInput({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  loading = false,
  maxLength = 500,
  className = '',
  autoFocus = false
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);
  
  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !loading) {
      onSend(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };
  
  const isNearLimit = message.length > maxLength * 0.8;
  const canSend = message.trim().length > 0 && !disabled && !loading;
  
  return (
    <div className={cn(
      'sticky bottom-0 left-0 right-0 bg-[var(--bg)]/80 backdrop-blur-md border-t border-[var(--subtle)]/20 p-4',
      className
    )}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={cn(
          'relative flex items-end space-x-3 p-3 rounded-2xl border transition-all duration-200 bg-[var(--panel)]',
          isFocused 
            ? 'border-[var(--accent)]/50 shadow-lg shadow-[var(--accent)]/10' 
            : 'border-[var(--subtle)]/20 hover:border-[var(--subtle)]/40'
        )}>
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled || loading}
              rows={1}
              className={cn(
                'w-full resize-none bg-transparent text-[var(--text)] placeholder-[var(--subtle)] border-none outline-none',
                'scrollbar-thin scrollbar-thumb-[var(--subtle)]/20 scrollbar-track-transparent',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              style={{
                minHeight: '24px',
                maxHeight: '120px'
              }}
              aria-label="Message input"
            />
            
            {/* Character count */}
            {(isNearLimit || message.length > 0) && (
              <div className={cn(
                'absolute -bottom-6 right-0 text-xs transition-colors duration-200',
                isNearLimit ? 'text-orange-400' : 'text-[var(--subtle)]'
              )}>
                {message.length}/{maxLength}
              </div>
            )}
          </div>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!canSend}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--panel)]',
              canSend
                ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-[var(--bg)] hover:shadow-lg hover:scale-105 active:scale-95'
                : 'bg-[var(--subtle)]/20 text-[var(--subtle)] cursor-not-allowed'
            )}
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Helper text */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="text-xs text-[var(--subtle)]">
            Press Enter to send, Shift+Enter for new line
          </div>
          
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[var(--accent)]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Wren is thinking...</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

// Specialized input for different contexts
export function SessionChatInput(props: Omit<ChatInputProps, 'placeholder'>) {
  return (
    <ChatInput
      placeholder="Share your thoughts or feelings..."
      {...props}
    />
  );
}

export function GuidedChatInput(props: Omit<ChatInputProps, 'placeholder' | 'disabled'>) {
  return (
    <ChatInput
      placeholder="Click 'Next Step' to continue the guided session"
      disabled={true}
      {...props}
    />
  );
}