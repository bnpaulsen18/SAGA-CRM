import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import SagaCard from '@/components/ui/saga-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import {
  calculateDonorRetention,
  calculateDonorLTV,
  calculateCohortAnalysis,
} from '@/lib/reports/donor-analytics'

export const runtime = 'nodejs'

const bricolage = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

export default async function AdvancedAnalyticsPage() {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()

  if (!session.user.organizationId) {
    return (
      <>
        <div className="py-20 text-center text-[var(--ink-soft)]">Organization not found</div>
      </>
    )
  }

  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 12)

  const [retentionMetrics, ltvMetrics, cohortData] = await Promise.all([
    calculateDonorRetention(prisma, session.user.organizationId, startDate, endDate),
    calculateDonorLTV(prisma, session.user.organizationId),
    calculateCohortAnalysis(prisma, session.user.organizationId, 6),
  ])

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <Link href="/reports">
          <Button variant="ghost" className="text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] mb-4 -ml-2">
            <ArrowLeft size={20} />
            Back to Reports
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={bricolage}>Advanced Donor Analytics</h1>
          <p className="text-[var(--ink-soft)]">
            Deep insights into donor retention, lifetime value, and cohort behavior
          </p>
        </div>
      </div>

      {/* Donor Retention Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-4" style={bricolage}>📊 Donor Retention Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SagaCard>
            <h3 className="text-sm font-medium text-[var(--ink-soft)] mb-2">Retention Rate</h3>
            <p className="text-4xl font-bold text-[var(--ink)] tabular-nums">
              {retentionMetrics.retentionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-[var(--ink-faint)] mt-2">
              {retentionMetrics.returningDonors} of {retentionMetrics.totalDonors} donors returned
            </p>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[var(--ink-faint)] mb-1">
                <span>Returning</span>
                <span>One-Time</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-[var(--surface-2)]">
                <div style={{ width: `${retentionMetrics.retentionRate}%`, background: '#5B4B8A' }} />
                <div style={{ width: `${100 - retentionMetrics.retentionRate}%`, background: '#E0507A' }} />
              </div>
            </div>
          </SagaCard>

          <SagaCard>
            <h3 className="text-sm font-medium text-[var(--ink-soft)] mb-2">Avg Donations per Donor</h3>
            <p className="text-4xl font-bold text-[var(--ink)] tabular-nums">
              {retentionMetrics.avgDonationsPerDonor.toFixed(1)}
            </p>
            <p className="text-sm text-[var(--ink-faint)] mt-2">
              {retentionMetrics.returningDonors > 0
                ? `${retentionMetrics.returningDonors} returning donors`
                : 'No returning donors yet'}
            </p>
          </SagaCard>

          <SagaCard>
            <h3 className="text-sm font-medium text-[var(--ink-soft)] mb-2">Avg Time Between Donations</h3>
            <p className="text-4xl font-bold text-[var(--ink)] tabular-nums">
              {retentionMetrics.avgMonthsBetweenDonations.toFixed(1)}
            </p>
            <p className="text-sm text-[var(--ink-faint)] mt-2">months</p>
          </SagaCard>
        </div>
      </div>

      {/* Lifetime Value Analysis */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-4" style={bricolage}>💰 Lifetime Value (LTV) Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SagaCard>
            <h3 className="text-lg font-bold text-[var(--ink)] mb-4">LTV Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--ink-soft)]">Average LTV</span>
                <span className="text-2xl font-bold text-[#4A8C6F] tabular-nums">
                  ${ltvMetrics.averageLTV.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--ink-soft)]">Median LTV</span>
                <span className="text-xl font-bold text-[var(--ink)] tabular-nums">
                  ${ltvMetrics.medianLTV.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--ink-soft)]">Top 25% LTV</span>
                <span className="text-xl font-bold text-[#5B4B8A] tabular-nums">
                  ${ltvMetrics.topQuartileLTV.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </SagaCard>

          <SagaCard>
            <h3 className="text-lg font-bold text-[var(--ink)] mb-4">LTV Distribution</h3>
            <div className="space-y-3">
              {ltvMetrics.ltvDistribution.map((bucket, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--ink-soft)]">{bucket.range}</span>
                    <span className="text-[var(--ink)] tabular-nums">
                      {bucket.count} ({bucket.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${bucket.percentage}%`, background: 'linear-gradient(90deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SagaCard>
        </div>
      </div>

      {/* Cohort Analysis */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--ink)] mb-4" style={bricolage}>📈 Cohort Analysis</h2>
        <SagaCard>
          <p className="text-[var(--ink-soft)] mb-4">
            Track how different cohorts of donors (grouped by first donation month) behave over time
          </p>

          {cohortData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th className="text-left text-[var(--ink-soft)] font-medium pb-3 pr-4">Cohort</th>
                    <th className="text-center text-[var(--ink-soft)] font-medium pb-3 px-2">Donors</th>
                    <th className="text-center text-[var(--ink-soft)] font-medium pb-3 px-2">M0</th>
                    <th className="text-center text-[var(--ink-soft)] font-medium pb-3 px-2">M1</th>
                    <th className="text-center text-[var(--ink-soft)] font-medium pb-3 px-2">M2</th>
                    <th className="text-center text-[var(--ink-soft)] font-medium pb-3 px-2">M3</th>
                    <th className="text-center text-[var(--ink-soft)] font-medium pb-3 px-2">M6</th>
                    <th className="text-center text-[var(--ink-soft)] font-medium pb-3 px-2">M12</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((cohort, i) => {
                    const monthsToShow = [0, 1, 2, 3, 6, 11]
                    return (
                      <tr key={i} className="border-b border-[var(--line)]">
                        <td className="py-3 pr-4 text-[var(--ink)] font-medium">
                          {new Date(cohort.cohortMonth + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-2 text-center text-[var(--ink)] tabular-nums">{cohort.donorCount}</td>
                        {monthsToShow.map((monthIndex) => {
                          const retention = cohort.retentionByMonth[monthIndex]
                          if (!retention) return <td key={monthIndex} className="py-3 px-2 text-center text-[var(--ink-faint)]">-</td>
                          const color =
                            retention.percentage >= 50 ? 'text-[#4A8C6F]' :
                            retention.percentage >= 25 ? 'text-[#B7791F]' :
                            retention.percentage > 0 ? 'text-[#E0507A]' :
                            'text-[var(--ink-faint)]'
                          return (
                            <td key={monthIndex} className={`py-3 px-2 text-center font-medium tabular-nums ${color}`}>
                              {retention.percentage > 0 ? `${retention.percentage.toFixed(0)}%` : '-'}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className="text-xs text-[var(--ink-faint)] mt-4">
                M0 = First donation month, M1 = 1 month later, M2 = 2 months later, etc.
              </p>
            </div>
          ) : (
            <p className="text-[var(--ink-faint)] text-center py-8">
              Not enough data for cohort analysis. Need donors with multiple donations over time.
            </p>
          )}
        </SagaCard>
      </div>
    </>
  )
}
