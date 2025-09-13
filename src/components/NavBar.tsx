'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';

interface NavBarProps {
  className?: string;
}

export default function NavBar({ className = '' }: NavBarProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--subtle)]/20 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group transition-all duration-200 hover:scale-105"
            aria-label="Wren Meditation Assistant - Home"
          >
            <div className="relative">
              <Heart 
                className="w-8 h-8 text-[var(--accent)] group-hover:text-[var(--accent-2)] transition-colors duration-200" 
                fill="currentColor"
              />
              <div className="absolute inset-0 bg-[var(--accent)] rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-200 animate-pulse" />
            </div>
            <span className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
              Wren
            </span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden sm:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-[var(--panel)] text-[var(--accent)] shadow-sm'
                  : 'text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--panel)]/50'
              }`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            
            <Link
              href="/session"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/session')
                  ? 'bg-[var(--panel)] text-[var(--accent)] shadow-sm'
                  : 'text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--panel)]/50'
              }`}
              aria-current={isActive('/session') ? 'page' : undefined}
            >
              Meditate
            </Link>
          </div>
          
          {/* Mobile Navigation */}
          <div className="sm:hidden flex items-center space-x-1">
            <Link
              href="/"
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-[var(--panel)] text-[var(--accent)]'
                  : 'text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--panel)]/50'
              }`}
              aria-label="Home"
            >
              Home
            </Link>
            
            <Link
              href="/session"
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/session')
                  ? 'bg-[var(--panel)] text-[var(--accent)]'
                  : 'text-[var(--subtle)] hover:text-[var(--text)] hover:bg-[var(--panel)]/50'
              }`}
              aria-label="Start Meditation"
            >
              Meditate
            </Link>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent" />
    </nav>
  );
}

// Spacer component to account for fixed navbar
export function NavBarSpacer() {
  return <div className="h-16" aria-hidden="true" />;
}