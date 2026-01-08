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

        {/* Export Buttons Skeleton */}
        <div className="flex gap-3 mb-8">
          <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
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

        {/* Chart Placeholder */}
        <SagaCard>
          <div className="h-80 bg-white/5 rounded animate-pulse" />
        </SagaCard>
      </div>
    </div>
  )
}
