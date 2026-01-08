import SagaCard from '@/components/ui/saga-card'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="h-6 w-32 bg-white/10 rounded-lg mb-4 animate-pulse" />
            <div className="h-10 w-64 bg-white/10 rounded-lg mb-3 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Donation Details Skeleton */}
          <SagaCard>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i}>
                  <div className="h-4 w-28 bg-white/10 rounded mb-1 animate-pulse" />
                  <div className="h-5 w-40 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </SagaCard>

          {/* Contact Info Skeleton */}
          <SagaCard>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-white/10 rounded mb-1 animate-pulse" />
                  <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </SagaCard>
        </div>

        {/* Activity Timeline Skeleton */}
        <SagaCard>
          <div className="space-y-3">
            <div className="h-6 w-40 bg-white/10 rounded mb-4 animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        </SagaCard>
      </div>
    </div>
  )
}
