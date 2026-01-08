import SagaCard from '@/components/ui/saga-card'

export default function Loading() {
  return (
    <div className="min-h-screen saga-gradient p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-white/10 rounded-lg mb-2 animate-pulse" />
          <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <SagaCard key={i}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-32 bg-white/10 rounded mb-3 animate-pulse" />
                  <div className="h-8 w-24 bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-full animate-pulse" />
              </div>
            </SagaCard>
          ))}
        </div>

        {/* Recent Donations & Top Campaigns Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <SagaCard key={i}>
              <div className="space-y-3">
                <div className="h-6 w-48 bg-white/10 rounded mb-4 animate-pulse" />
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-20 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            </SagaCard>
          ))}
        </div>
      </div>
    </div>
  )
}
