'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Gear, MagnifyingGlass, User } from '@phosphor-icons/react'
import DashboardNavNew from './DashboardNavNew'

interface DashboardLayoutProps {
  children: React.ReactNode
  userName: string
  userRole?: string
  searchPlaceholder?: string
}

interface SearchResult {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  type: string
  status: string
  lifetimeGiving: number
  _count: {
    donations: number
  }
}

export default function DashboardLayout({
  children,
  userName,
  userRole,
  searchPlaceholder = "Search contacts, donations..."
}: DashboardLayoutProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounced search effect
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsSearching(true)
        try {
          const response = await fetch(`/api/contacts/search?q=${encodeURIComponent(searchTerm)}`)
          const data = await response.json()
          setSearchResults(data || [])
          setShowResults(true)
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (contactId: string) => {
    setSearchTerm('')
    setShowResults(false)
    router.push(`/contacts/${contactId}`)
  }

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
            {/* Search Bar with Results Dropdown */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                  className="w-[300px] pl-10 pr-5 py-2.5 rounded-lg text-white text-[0.95rem] transition-all duration-200 bg-white/10 border border-white/20 outline-none focus:border-[#ffa07a] focus:bg-white/15"
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 w-full max-h-[400px] overflow-y-auto bg-[#1a0a2e]/98 backdrop-blur-md border border-[#ffa07a]/30 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-50">
                  {isSearching ? (
                    <div className="px-4 py-3 text-white/60 text-sm">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.id)}
                          className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 flex items-center gap-3"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#764ba2]/20 border border-[#764ba2]/40">
                            <User size={16} weight="bold" className="text-white/70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {result.firstName} {result.lastName}
                            </p>
                            <p className="text-white/50 text-sm truncate">{result.email}</p>
                            {result.lifetimeGiving > 0 && (
                              <p className="text-green-400 text-xs mt-0.5">
                                ${result.lifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • {result._count.donations} gift{result._count.donations !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded text-xs bg-[#764ba2]/20 text-white/70 border border-[#764ba2]/30">
                              {result.type}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs border ${
                                result.status === 'ACTIVE'
                                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                  : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                              }`}
                            >
                              {result.status}
                            </span>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-white/60 text-sm">
                      No contacts found
                    </div>
                  )}
                </div>
              )}
            </div>

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
