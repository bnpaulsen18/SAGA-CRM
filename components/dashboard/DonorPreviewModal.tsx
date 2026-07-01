'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X } from '@phosphor-icons/react/dist/ssr'
import { money, type AttentionDonor } from '@/lib/dashboard/build-dashboard-viewmodel'
import { statusStyle } from './DashboardSections'

const whyFlagged: Record<AttentionDonor['status'], (d: AttentionDonor) => string> = {
  'Lapse risk': (d) => `Gave ${d.count === 1 ? 'once' : `${d.count} times`}, nothing in ${Math.round(d.monthsSince)} months — SAGA flags donors like this before they're fully lapsed.`,
  Cooling: (d) => `Engagement has slowed since their last gift ${Math.round(d.monthsSince)} months ago — a personal update now can prevent a full lapse.`,
  'New donor': () => `First gift within the last two months — early outreach dramatically improves the odds of a second gift.`,
  Champion: (d) => `${money(d.lifetime)} given and still active — a strong moment to invite a deeper commitment.`,
  Active: () => `Steady, engaged donor.`,
}

/**
 * Read-only donor detail for the public /demo page — reuses data already
 * fetched for the page (no new query, no auth needed). Used in place of
 * linking to the auth-gated /contacts/[id] that a logged-out visitor can't reach.
 */
export default function DonorPreviewModal({ donor, onClose }: { donor: AttentionDonor | null; onClose: () => void }) {
  useEffect(() => {
    if (!donor) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [donor, onClose])

  if (!donor) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-6 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: statusStyle[donor.status].color }}
            >
              {donor.initials}
            </span>
            <div>
              <p className="font-bold text-[var(--ink)]">{donor.name}</p>
              <span
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-md mt-0.5"
                style={{ color: statusStyle[donor.status].color, background: statusStyle[donor.status].bg }}
              >
                {donor.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-[var(--ink-faint)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3">
            <p className="text-xs text-[var(--ink-faint)] mb-1">Lifetime giving</p>
            <p className="text-lg font-bold text-[var(--ink)] tabular-nums text-right">{money(donor.lifetime)}</p>
          </div>
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-xl p-3">
            <p className="text-xs text-[var(--ink-faint)] mb-1">Last gift</p>
            <p className="text-lg font-bold text-[var(--ink)] tabular-nums text-right">{Math.round(donor.monthsSince)}mo ago</p>
          </div>
        </div>

        <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-5">{whyFlagged[donor.status](donor)}</p>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--line)]">
          <p className="text-sm font-medium text-[var(--ink)]">SAGA suggests: {donor.suggestion}</p>
        </div>

        <Link
          href="/register"
          className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg border border-[var(--twilight)] text-[var(--twilight)] font-semibold text-sm hover:bg-[var(--twilight)] hover:text-white transition-colors"
        >
          See this for your own donors — Start Free
        </Link>
      </div>
    </div>
  )
}
