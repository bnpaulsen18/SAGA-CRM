/**
 * Enhanced Donor Analytics
 * Provides deep insights into donor behavior, retention, and lifetime value
 */

export interface DonorRetentionMetrics {
  totalDonors: number
  returningDonors: number
  oneTimeDonors: number
  retentionRate: number
  avgDonationsPerDonor: number
  avgMonthsBetweenDonations: number
}

export interface DonorLTVMetrics {
  averageLTV: number
  medianLTV: number
  topQuartileLTV: number
  ltvDistribution: {
    range: string
    count: number
    percentage: number
  }[]
}

export interface CohortData {
  cohortMonth: string
  donorCount: number
  retentionByMonth: { month: number; retained: number; percentage: number }[]
}

/**
 * Calculate donor retention metrics
 */
export async function calculateDonorRetention(
  prisma: any,
  organizationId: string,
  startDate: Date,
  endDate: Date
): Promise<DonorRetentionMetrics> {
  // Get all donations in period
  const donations = await prisma.donation.findMany({
    where: {
      organizationId,
      status: 'COMPLETED',
      donatedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      contactId: true,
      donatedAt: true
    },
    orderBy: {
      donatedAt: 'asc'
    }
  })

  // Group by donor
  const donorMap = new Map<string, Date[]>()
  donations.forEach((d: { contactId: string; donatedAt: Date }) => {
    if (!donorMap.has(d.contactId)) {
      donorMap.set(d.contactId, [])
    }
    donorMap.get(d.contactId)!.push(d.donatedAt)
  })

  const totalDonors = donorMap.size
  const returningDonors = Array.from(donorMap.values()).filter(dates => dates.length > 1).length
  const oneTimeDonors = totalDonors - returningDonors
  const retentionRate = totalDonors > 0 ? (returningDonors / totalDonors) * 100 : 0

  // Calculate average donations per donor
  const totalDonations = donations.length
  const avgDonationsPerDonor = totalDonors > 0 ? totalDonations / totalDonors : 0

  // Calculate average months between donations (for returning donors)
  let totalMonthsBetween = 0
  let gapCount = 0

  donorMap.forEach(dates => {
    if (dates.length > 1) {
      for (let i = 1; i < dates.length; i++) {
        const monthsDiff = (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24 * 30)
        totalMonthsBetween += monthsDiff
        gapCount++
      }
    }
  })

  const avgMonthsBetweenDonations = gapCount > 0 ? totalMonthsBetween / gapCount : 0

  return {
    totalDonors,
    returningDonors,
    oneTimeDonors,
    retentionRate,
    avgDonationsPerDonor,
    avgMonthsBetweenDonations
  }
}

/**
 * Calculate Lifetime Value (LTV) metrics
 */
export async function calculateDonorLTV(
  prisma: any,
  organizationId: string
): Promise<DonorLTVMetrics> {
  // Get all completed donations grouped by contact
  const donations = await prisma.donation.findMany({
    where: {
      organizationId,
      status: 'COMPLETED'
    },
    select: {
      contactId: true,
      amount: true
    }
  })

  // Calculate LTV per donor
  const ltvMap = new Map<string, number>()
  donations.forEach((d: { contactId: string; amount: number }) => {
    ltvMap.set(d.contactId, (ltvMap.get(d.contactId) || 0) + d.amount)
  })

  const ltvValues = Array.from(ltvMap.values()).sort((a, b) => a - b)

  if (ltvValues.length === 0) {
    return {
      averageLTV: 0,
      medianLTV: 0,
      topQuartileLTV: 0,
      ltvDistribution: []
    }
  }

  // Calculate metrics
  const averageLTV = ltvValues.reduce((sum, val) => sum + val, 0) / ltvValues.length
  const medianLTV = ltvValues[Math.floor(ltvValues.length / 2)]
  const topQuartileIndex = Math.floor(ltvValues.length * 0.75)
  const topQuartileLTV = ltvValues[topQuartileIndex]

  // LTV distribution buckets
  const buckets = [
    { min: 0, max: 100, range: '$0-$100' },
    { min: 100, max: 500, range: '$100-$500' },
    { min: 500, max: 1000, range: '$500-$1,000' },
    { min: 1000, max: 5000, range: '$1,000-$5,000' },
    { min: 5000, max: Infinity, range: '$5,000+' }
  ]

  const distribution = buckets.map(bucket => {
    const count = ltvValues.filter(v => v >= bucket.min && v < bucket.max).length
    return {
      range: bucket.range,
      count,
      percentage: (count / ltvValues.length) * 100
    }
  })

  return {
    averageLTV,
    medianLTV,
    topQuartileLTV,
    ltvDistribution: distribution
  }
}

/**
 * Calculate cohort analysis
 * Groups donors by their first donation month and tracks retention
 */
export async function calculateCohortAnalysis(
  prisma: any,
  organizationId: string,
  monthsBack: number = 12
): Promise<CohortData[]> {
  // Get all donations
  const donations = await prisma.donation.findMany({
    where: {
      organizationId,
      status: 'COMPLETED'
    },
    select: {
      contactId: true,
      donatedAt: true
    },
    orderBy: {
      donatedAt: 'asc'
    }
  })

  // Find first donation date for each donor
  const firstDonationMap = new Map<string, Date>()
  donations.forEach((d: { contactId: string; donatedAt: Date }) => {
    if (!firstDonationMap.has(d.contactId)) {
      firstDonationMap.set(d.contactId, d.donatedAt)
    }
  })

  // Group donors by cohort (first donation month)
  const cohortMap = new Map<string, Set<string>>()
  firstDonationMap.forEach((firstDate, contactId) => {
    const cohortKey = `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}`
    if (!cohortMap.has(cohortKey)) {
      cohortMap.set(cohortKey, new Set())
    }
    cohortMap.get(cohortKey)!.add(contactId)
  })

  // Calculate retention for each cohort
  const cohorts: CohortData[] = []

  // Get the last N months
  const now = new Date()
  const cohortMonths = []
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    cohortMonths.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }

  cohortMonths.forEach(cohortMonth => {
    const cohortDonors = cohortMap.get(cohortMonth) || new Set()

    if (cohortDonors.size === 0) {
      return // Skip empty cohorts
    }

    const cohortStartDate = new Date(cohortMonth + '-01')
    const retentionByMonth: { month: number; retained: number; percentage: number }[] = []

    // Track retention for up to 12 months
    for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
      const checkDate = new Date(cohortStartDate)
      checkDate.setMonth(checkDate.getMonth() + monthOffset)
      const nextMonth = new Date(checkDate)
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      // Count donors who donated in this month
      const retainedDonors = donations.filter((d: { contactId: string; donatedAt: Date }) => {
        return cohortDonors.has(d.contactId) &&
               d.donatedAt >= checkDate &&
               d.donatedAt < nextMonth
      })

      const uniqueRetained = new Set(retainedDonors.map((d: { contactId: string }) => d.contactId)).size
      const retentionPercentage = (uniqueRetained / cohortDonors.size) * 100

      retentionByMonth.push({
        month: monthOffset,
        retained: uniqueRetained,
        percentage: retentionPercentage
      })
    }

    cohorts.push({
      cohortMonth,
      donorCount: cohortDonors.size,
      retentionByMonth
    })
  })

  return cohorts.reverse() // Most recent cohort first
}
