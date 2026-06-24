export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--paper)] p-8">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="h-9 w-56 bg-[var(--surface-2)] rounded-lg mb-3" />
        <div className="h-5 w-80 bg-[var(--surface-2)] rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6">
              <div className="h-5 w-28 bg-[var(--surface-2)] rounded mb-3" />
              <div className="h-8 w-24 bg-[var(--surface-2)] rounded" />
            </div>
          ))}
        </div>
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 space-y-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[var(--surface-2)] rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
