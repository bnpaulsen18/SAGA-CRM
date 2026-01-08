import SagaCard from '@/components/ui/saga-card'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-10 w-48 bg-white/10 rounded-lg mb-2 animate-pulse" />
            <div className="h-6 w-64 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <SagaCard key={i}>
              <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-8 w-28 bg-white/10 rounded mb-1 animate-pulse" />
              <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            </SagaCard>
          ))}
        </div>

        {/* Table Skeleton */}
        <SagaCard>
          <div className="space-y-3">
            {/* Table Header */}
            <div className="h-10 bg-white/5 rounded animate-pulse" />
            {/* Table Rows */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        </SagaCard>
      </div>
    </div>
  )
}
