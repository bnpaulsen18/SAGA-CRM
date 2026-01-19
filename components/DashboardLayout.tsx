'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, MagnifyingGlass, User, SignOut } from '@phosphor-icons/react/dist/ssr'
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

  // Get user initials
  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[1000] bg-[#0a0a1a]/80 backdrop-blur-xl border-b border-white/5 h-[70px]">
        <div className="flex items-center justify-between h-full px-6 max-w-[1800px] mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-4">
              <Image
                src="/SAGA_Logo_clean.png"
                alt="SAGA CRM"
                width={120}
                height={48}
                className="h-12 w-auto transition-all duration-300 hover:scale-105"
                priority
              />
              <span className="hidden lg:block text-white/60 text-sm font-medium">
                Nonprofit CRM
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search Bar with Results Dropdown */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                  className="w-64 lg:w-80 pl-10 pr-4 py-2.5 rounded-xl text-white text-sm transition-all duration-200 bg-white/5 border border-white/10 outline-none focus:border-purple-500/50 focus:bg-white/10 placeholder:text-white/40"
                />
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full mt-2 w-full max-h-[400px] overflow-y-auto bg-[#0a0a1a]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
                  {isSearching ? (
                    <div className="px-4 py-3 text-white/60 text-sm flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result.id)}
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 flex items-center gap-3"
                        >
                          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
                            <User size={16} weight="bold" className="text-white/70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {result.firstName} {result.lastName}
                            </p>
                            <p className="text-white/40 text-sm truncate">{result.email}</p>
                            {result.lifetimeGiving > 0 && (
                              <p className="text-emerald-400 text-xs mt-0.5">
                                ${result.lifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • {result._count.donations} gift{result._count.donations !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-lg text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {result.type}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-lg text-xs border ${
                                result.status === 'ACTIVE'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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

            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
            </button>

            {/* Profile / Sign Out */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white text-sm font-bold">{userInitials}</span>
              </div>
              <span className="text-white text-sm font-medium hidden md:block">{userName}</span>
              <SignOut size={18} className="text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <DashboardNavNew />

      {/* Main Content */}
      <main className="relative p-6 max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  )
}
