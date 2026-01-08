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
    <div className="min-h-screen saga-gradient">
      {/* Header */}
      <header
        className="sticky top-0 z-[1000] saga-header-gradient border-b-2 saga-border-orange h-[75px] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
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
                className="h-[55px] w-auto transition-all duration-300 hover:scale-105 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
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
              className="w-[300px] px-5 py-2.5 rounded-lg text-white text-[0.95rem] transition-all duration-200 bg-white/10 border border-white/20 outline-none focus:border-[#ffa07a] focus:bg-white/15"
            />

            {/* Settings/Profile */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-5 py-2.5 rounded-lg font-semibold text-[0.95rem] text-white flex items-center gap-2 transition-all duration-200 bg-[#764ba2] border-2 border-[#764ba2] shadow-[0_2px_8px_rgba(118,75,162,0.3)] hover:-translate-y-px hover:bg-[#8b5fb8] hover:border-[#8b5fb8] hover:shadow-[0_4px_12px_rgba(118,75,162,0.4)]"
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
