import SagaCard from '@/components/ui/saga-card'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-white/10 rounded-lg mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-white/10 rounded-lg mb-2 animate-pulse" />
          <div className="h-6 w-80 bg-white/10 rounded-lg animate-pulse" />
        </div>

        {/* Form Skeleton */}
        <SagaCard title="Contact Information">
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-24 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-24 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            {/* Email/Phone Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-16 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-16 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            {/* Address Field */}
            <div>
              <div className="h-4 w-32 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-10 bg-white/10 rounded animate-pulse" />
            </div>

            {/* City/State/ZIP Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-4 w-16 bg-white/10 rounded mb-2 animate-pulse" />
                  <div className="h-10 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Type/Status Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-24 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-16 bg-white/10 rounded mb-2 animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <div className="h-4 w-16 bg-white/10 rounded mb-2 animate-pulse" />
              <div className="h-24 bg-white/10 rounded animate-pulse" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </SagaCard>
      </div>
    </div>
  )
}
