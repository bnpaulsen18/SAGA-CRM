'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import {
  Sun, Moon, Info, House, Users, CurrencyDollar, Megaphone, EnvelopeSimple,
  Sparkle, PenNib, Lightning, Gift, Globe, ChartBar, Gear,
} from '@phosphor-icons/react/dist/ssr'

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'
const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

type NavItem = { label: string; icon: typeof House; soon?: boolean; active?: boolean }
type NavGroup = { group: string; items: NavItem[] }

// Mirrors the real DashboardLayout's NAV structure so /demo reads as the
// actual product, not an approximation. Every non-"soon" item routes to
// /register instead of its real (auth-gated) destination.
const NAV: NavGroup[] = [
  { group: 'Overview', items: [
    { label: 'Dashboard', icon: House, active: true },
  ] },
  { group: 'Engage', items: [
    { label: 'Donors', icon: Users },
    { label: 'Donations', icon: CurrencyDollar },
    { label: 'Campaigns', icon: Megaphone },
    { label: 'Communications', icon: EnvelopeSimple },
  ] },
  { group: 'AI', items: [
    { label: 'Assistant', icon: Sparkle, soon: true },
    { label: 'Content Studio', icon: PenNib, soon: true },
    { label: 'Automations', icon: Lightning, soon: true },
  ] },
  { group: 'Manage', items: [
    { label: 'Donation Pages', icon: Globe, soon: true },
    { label: 'Donor Gifts', icon: Gift, soon: true },
    { label: 'Reports', icon: ChartBar },
    { label: 'Settings', icon: Gear },
  ] },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-all"
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {resolvedTheme === 'dark' ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
    </button>
  )
}

/**
 * Public /demo shell — visually mirrors components/DashboardLayout.tsx's
 * sidebar+topbar structure so the page reads as the real product, but every
 * interactive element is safe for a logged-out visitor: nav items route to
 * /register instead of auth-gated pages, no sign-out, no live search.
 */
export default function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col sticky top-0 h-screen bg-[var(--surface)] border-r border-[var(--line)] px-3 py-5 overflow-y-auto">
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-7">
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
                      <div key={item.label} className="flex items-center gap-3 px-2.5 py-2 rounded-lg text-[#B7AFBC] cursor-default select-none">
                        <Icon size={18} />
                        <span className="text-sm font-medium">{item.label}</span>
                        <span className="ml-auto text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--ink-faint)]">Soon</span>
                      </div>
                    )
                  }
                  return (
                    <Link
                      key={item.label}
                      href={item.active ? '/demo' : '/register'}
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active ? 'bg-[var(--surface-2)] text-[var(--ink)]' : 'text-[var(--ink-soft)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <Icon size={18} weight={item.active ? 'fill' : 'regular'} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <Link
          href="/register"
          className="mt-4 flex items-center justify-center gap-2 px-2.5 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-95 transition-all"
          style={{ background: SUNSET }}
        >
          Start Free
        </Link>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-50 bg-[var(--paper)]/85 backdrop-blur-xl border-b border-[var(--line)]">
          <div className="flex flex-wrap items-center gap-3 min-h-[64px] px-6 py-2">
            {/* Mobile logo (sidebar hidden < lg) */}
            <Link href="/" className="lg:hidden flex items-center gap-2 flex-shrink-0">
              <Image src="/SAGA_mark.png" alt="SAGA" width={28} height={28} className="h-7 w-7" />
              <span className="text-[var(--ink)] text-lg font-bold tracking-tight" style={bricolage}>SAGA</span>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 text-[var(--ink)] text-sm min-w-0">
              <Info size={15} weight="bold" className="flex-shrink-0 text-[var(--ink-soft)]" />
              <span className="truncate">You&rsquo;re viewing SAGA with sample data from a fictional nonprofit — not a live account.</span>
            </div>
            <div className="md:hidden text-[var(--ink)] text-xs">
              Sample data preview — not a live account.
            </div>

            <div className="flex items-center gap-3 ml-auto flex-shrink-0">
              <ThemeToggle />
              <Link href="/login" className="hidden sm:inline text-[var(--ink-soft)] hover:text-[var(--ink)] transition font-medium text-sm">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-white font-semibold rounded-lg hover:opacity-95 transition-all text-sm whitespace-nowrap"
                style={{ background: SUNSET }}
              >
                Start Free
              </Link>
            </div>
          </div>
        </header>

        <main className="p-6 max-w-[1600px] w-full mx-auto">{children}</main>

        <div className="max-w-[1600px] w-full mx-auto px-6 pb-10">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
            <h2 style={bricolage} className="text-2xl font-bold text-[var(--ink)] mb-2">Like what you see?</h2>
            <p className="text-[var(--ink-soft)] mb-5">Create your own SAGA account — free to start, no credit card required.</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl hover:opacity-95 transition-all"
              style={{ background: SUNSET }}
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
