'use client'

import { useState } from 'react'
import { MorningBrief, GivingChart, AttentionTable, type LinkFor } from './DashboardSections'
import DonorPreviewModal from './DonorPreviewModal'
import type { DashboardViewModel, AttentionDonor } from '@/lib/dashboard/build-dashboard-viewmodel'

/**
 * Owns the "which donor is being previewed" state shared between the Morning
 * Brief cards and the attention table, so a click in either place opens the
 * same modal instead of bouncing an anonymous visitor to a login-gated route.
 */
export default function DemoDonorSections({ vm, linkFor }: { vm: DashboardViewModel; linkFor: LinkFor }) {
  const [selected, setSelected] = useState<AttentionDonor | null>(null)

  return (
    <>
      <MorningBrief vm={vm} onDonorSelect={setSelected} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <GivingChart months={vm.months} linkFor={linkFor} />
        <AttentionTable vm={vm} onDonorSelect={setSelected} />
      </div>

      <DonorPreviewModal donor={selected} onClose={() => setSelected(null)} />
    </>
  )
}
