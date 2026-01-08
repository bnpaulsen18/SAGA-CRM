'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Gear } from '@phosphor-icons/react'
import DashboardNavNew from './DashboardNavNew'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName: string
  userRole?: string
  searchPlaceholder?: string
}

export default function DashboardLayout({
  children,
  userName,
  userRole,
  searchPlaceholder = "Search contacts, donations..."
}: DashboardLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    }}>
      {/* Header */}
      <header
        className="sticky top-0 z-[1000]"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b3d 25%, #5c1644 50%, #8b1e4b 75%, #b4154b 85%, #ff6b35 100%)',
          borderBottom: '2px solid rgba(255, 107, 53, 0.3)',
          height: '75px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}
      >
        <div className="flex items-center justify-between h-full px-10">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-6">
              <Image
                src="/SAGA_Logo_clean.png"
                alt="SAGA CRM"
                width={140}
                height={55}
                className="h-[55px] w-auto transition-all duration-300 hover:scale-105"
                style={{
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                }}
                priority
              />
              <span className="text-white/85 text-base font-normal tracking-wide">
                Nonprofit CRM & Donor Management
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] px-5 py-2.5 rounded-lg text-white text-[0.95rem] transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffa07a'
                e.target.style.background = 'rgba(255,255,255,0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.2)'
                e.target.style.background = 'rgba(255,255,255,0.1)'
              }}
            />

            {/* Settings/Profile */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-5 py-2.5 rounded-lg font-semibold text-[0.95rem] text-white flex items-center gap-2 transition-all duration-200"
              style={{
                background: '#764ba2',
                border: '2px solid #764ba2',
                boxShadow: '0 2px 8px rgba(118, 75, 162, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8b5fb8'
                e.currentTarget.style.borderColor = '#8b5fb8'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(118, 75, 162, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#764ba2'
                e.currentTarget.style.borderColor = '#764ba2'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(118, 75, 162, 0.3)'
              }}
            >
              <Gear size={18} weight="bold" />
              <span>{userName}</span>
              <span className="text-white/70">•</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <DashboardNavNew />

      {/* Main Content */}
      <main className="p-8 max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  )
}
