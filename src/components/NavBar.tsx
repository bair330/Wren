'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavBarProps {
  className?: string
}

export default function NavBar({ className = '' }: NavBarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'text-green-400' : 'hover:text-green-400 transition-colors'
  }

  return (
    <nav className={`flex items-center justify-between p-6 ${className}`}>
      <Link href="/" className="text-2xl font-bold text-green-400">
        Wren
      </Link>
      <div className="flex space-x-6">
        <Link href="/" className={isActive('/')}>
          Home
        </Link>
        <Link href="/dashboard" className={isActive('/dashboard')}>
          Dashboard
        </Link>
        <Link href="/about" className={isActive('/about')}>
          About
        </Link>
      </div>
    </nav>
  )
}