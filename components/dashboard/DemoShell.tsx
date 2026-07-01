'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Info } from '@phosphor-icons/react/dist/ssr'

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'
const WORDMARK = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

/**
 * Minimal, mostly-static shell for the public /demo page. Deliberately NOT a
 * reuse of components/DashboardLayout.tsx — that component wires a working
 * sign-out button and a live search box hitting an authenticated API, both
 * of which would be broken/misleading on a logged-out page.
 */
export default function DemoShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="sticky top-0 z-50 bg-[var(--paper)]/85 backdrop-blur-xl border-b border-[var(--line)]">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex flex-wrap items-center gap-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/SAGA_mark.png" alt="SAGA" className="h-7 w-auto" />
            <span style={WORDMARK} className="text-lg font-bold tracking-tight text-[var(--ink)]">SAGA</span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 text-[var(--ink)] text-sm min-w-0">
            <Info size={15} weight="bold" className="flex-shrink-0 text-[var(--ink-soft)]" />
            <span className="truncate">You&rsquo;re viewing SAGA with sample data from a fictional nonprofit — not a live account.</span>
          </div>
          <div className="md:hidden text-[var(--ink)] text-xs">
            Sample data preview — not a live account.
          </div>

          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-all"
                aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {resolvedTheme === 'dark' ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
              </button>
            )}
            <Link href="/login" className="text-[var(--ink-soft)] hover:text-[var(--ink)] transition font-medium text-sm">
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

      <div className="max-w-[1600px] mx-auto px-6 pb-10">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
          <h2 style={WORDMARK} className="text-2xl font-bold text-[var(--ink)] mb-2">Like what you see?</h2>
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
  )
}
