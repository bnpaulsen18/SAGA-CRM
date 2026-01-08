import SagaCard from '@/components/ui/saga-card'

export default function Loading() {
  return (
    <div className="min-h-screen saga-gradient p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-white/10 rounded-lg mb-4 animate-pulse" />
          <div className="h-10 w-72 bg-white/10 rounded-lg mb-2 animate-pulse" />
          <div className="h-6 w-64 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Form Skeleton */}
        <SagaCard title="Donation Details">
          <div className="space-y-6">
            {/* Contact/Campaign Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="h-10 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Amount/Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="h-4 w-20 bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="h-10 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Payment Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i}>
                  <div className="h-4 w-28 bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="h-10 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <div className="h-4 w-16 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-24 bg-white/10 rounded animate-pulse" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <div className="h-10 w-40 bg-white/10 rounded animate-pulse" />
              <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </SagaCard>
      </div>
    </div>
  )
}
