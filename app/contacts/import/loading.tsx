import SagaCard from '@/components/ui/saga-card'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-white/10 rounded-lg mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-white/10 rounded-lg mb-2 animate-pulse" />
          <div className="h-6 w-96 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Wizard Steps Skeleton */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1">
              <div className="h-2 bg-white/10 rounded-full mb-2 animate-pulse" />
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>

        {/* Upload Area Skeleton */}
        <SagaCard>
          <div className="py-12 text-center">
            <div className="h-16 w-16 bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-64 bg-white/10 rounded mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-80 bg-white/10 rounded mx-auto mb-6 animate-pulse" />
            <div className="h-10 w-40 bg-white/10 rounded mx-auto animate-pulse" />
          </div>
        </SagaCard>
      </div>
    </div>
  )
}
