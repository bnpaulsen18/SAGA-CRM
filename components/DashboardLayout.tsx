'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Bell, MagnifyingGlass, User, SignOut, House, Users, CurrencyDollar,
  Megaphone, EnvelopeSimple, Sparkle, PenNib, Lightning, Gift, Globe,
  ChartBar, Gear, Sun, Moon,
} from '@phosphor-icons/react/dist/ssr'

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
  _count: { donations: number }
}

type NavItem = { label: string; href: string; icon: typeof House; soon?: boolean }
type NavGroup = { group: string; items: NavItem[] }

const NAV: NavGroup[] = [
  { group: 'Overview', items: [
    { label: 'Dashboard', href: '/dashboard', icon: House },
  ] },
  { group: 'Engage', items: [
    { label: 'Donors', href: '/contacts', icon: Users },
    { label: 'Donations', href: '/donations', icon: CurrencyDollar },
    { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
    { label: 'Communications', href: '/emails/compose', icon: EnvelopeSimple },
  ] },
  { group: 'AI', items: [
    { label: 'Assistant', href: '/assistant', icon: Sparkle, soon: true },
    { label: 'Content Studio', href: '/content', icon: PenNib, soon: true },
    { label: 'Automations', href: '/automations', icon: Lightning, soon: true },
  ] },
  { group: 'Manage', items: [
    { label: 'Donation Pages', href: '/donation-pages', icon: Globe, soon: true },
    { label: 'Donor Gifts', href: '/gifts', icon: Gift, soon: true },
    { label: 'Reports', href: '/reports', icon: ChartBar },
    { label: 'Settings', href: '/settings', icon: Gear },
  ] },
]

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

export default function DashboardLayout({
  children,
  userName,
  userRole,
  searchPlaceholder = 'Search contacts, donations...',
}: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

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

  const userInitials = userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  const isActive = (href: string) => (href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href))

  return (
    <div className="min-h-screen bg-[var(--paper)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col sticky top-0 h-screen bg-[var(--surface)] border-r border-[var(--line)] px-3 py-5 overflow-y-auto">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-7">
          <Image src="/SAGA_mark.png" alt="SAGA" width={32} height={32} className="h-8 w-8" priority />
          <span className="text-[var(--ink)] text-xl font-bold tracking-tight" style={bricolage}>SAGA</span>
        </Link>

        <nav className="flex-1 space-y-5">
          {NAV.map((g) => (
            <div key={g.group}>
              <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--ink-faint)]">{g.group}</p>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const Icon = item.icon
                  if (item.soon) {
                    return (
                      <div key={item.href} className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-[#B7AFBC] cursor-default select-none">
                        <Icon size={18} />
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="ml-auto text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-faint)]">Soon</span>
                      </div>
                    )
                  }
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active ? 'bg-[var(--surface-2)] text-[var(--ink)]' : 'text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <Icon size={18} weight={active ? 'fill' : 'regular'} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="mt-4 flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors text-left w-full"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A)' }}>
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[var(--ink)] truncate">{userName}</p>
            <p className="text-xs text-[var(--ink-faint)] truncate capitalize">{(userRole || 'Member').toLowerCase()}</p>
          </div>
          <SignOut size={16} className="text-[var(--ink-faint)]" />
        </button>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-[1000] bg-[var(--paper)]/85 backdrop-blur-xl border-b border-[var(--line)]">
          <div className="flex items-center gap-4 h-[64px] px-6">
            {/* Mobile logo (sidebar hidden < lg) */}
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
              <Image src="/SAGA_mark.png" alt="SAGA" width={28} height={28} className="h-7 w-7" />
              <span className="text-[var(--ink)] text-lg font-bold tracking-tight" style={bricolage}>SAGA</span>
            </Link>

            {/* Search */}
            <div ref={searchRef} className="relative flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlass size={18} weight="bold" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]" />
                <input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-[var(--ink)] text-sm transition-all duration-200 bg-[var(--surface)] border border-[var(--line)] outline-none focus:border-[#5B4B8A] placeholder:text-[var(--ink-faint)]"
                />
              </div>

              {showResults && (
                <div className="absolute top-full mt-2 w-full max-h-[400px] overflow-y-auto bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-xl z-50">
                  {isSearching ? (
                    <div className="px-4 py-3 text-[var(--ink-soft)] text-sm flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[var(--line)] border-t-[#5B4B8A] rounded-full animate-spin" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.id)}
                        className="w-full px-4 py-3 text-left hover:bg-[var(--surface-2)] transition-colors border-b border-[var(--line)] last:border-b-0 flex items-center gap-3"
                      >
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#5B4B8A]/10 border border-[#5B4B8A]/20">
                          <User size={16} weight="bold" className="text-[#5B4B8A]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[var(--ink)] font-medium truncate">{result.firstName} {result.lastName}</p>
                          <p className="text-[var(--ink-faint)] text-sm truncate">{result.email}</p>
                          {result.lifetimeGiving > 0 && (
                            <p className="text-[#4A8C6F] text-xs mt-0.5">
                              ${result.lifetimeGiving.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • {result._count.donations} gift{result._count.donations !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <span className="px-2 py-1 rounded-md text-xs bg-[#5B4B8A]/10 text-[#4A3B6B] border border-[#5B4B8A]/20 flex-shrink-0">
                          {result.type}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-[var(--ink-soft)] text-sm">No contacts found</div>
                  )}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-all"
                  aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                >
                  {resolvedTheme === 'dark' ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
                </button>
              )}
              <button className="relative p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E0507A] rounded-full" />
              </button>
              {/* Mobile sign-out (sidebar profile hidden < lg) */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A)' }}
                aria-label="Account"
              >
                {userInitials}
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-[1600px] w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
