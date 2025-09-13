import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import NavBar from '@/components/NavBar'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Wren - Meditation Assistant',
  description: 'Breathe. Relax. Begin. A gentle, guided meditation experience.',
  keywords: ['meditation', 'mindfulness', 'stress relief', 'breathing', 'wellness'],
  authors: [{ name: 'Wren Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B1020',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  )
}