import SagaCard from '@/components/ui/saga-card'

export default function Loading() {
  return (
    <div className="min-h-screen saga-gradient p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <div className="h-6 w-32 bg-white/10 rounded-lg mb-4 animate-pulse" />
            <div className="h-10 w-96 bg-white/10 rounded-lg mb-2 animate-pulse" />
            <div className="h-6 w-64 bg-white/10 rounded-lg mb-3 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <SagaCard key={i}>
              <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-8 w-24 bg-white/10 rounded mb-1 animate-pulse" />
              <div className="h-3 w-20 bg-white/10 rounded animate-pulse" />
            </SagaCard>
          ))}
        </div>

        {/* Contact Details & Recent Donations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details Skeleton */}
          <SagaCard>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-white/10 rounded mb-1 animate-pulse" />
                  <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </SagaCard>

          {/* Recent Donations Skeleton */}
          <SagaCard>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          </SagaCard>
        </div>
      </div>
    </div>
  )
}
