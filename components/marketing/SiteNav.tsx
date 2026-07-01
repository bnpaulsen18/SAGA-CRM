import Link from 'next/link'

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'
const WORDMARK = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

/**
 * Shared marketing-site navigation. Used on the landing page and every
 * public sub-page (about, contact, pricing, security, legal) so the brand
 * and links stay consistent and dead links are fixed in one place.
 */
export default function SiteNav() {
  return (
    <nav className="sticky top-0 z-40 bg-[#FAF6EF]/80 backdrop-blur-xl border-b border-[#E8E1D7]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/SAGA_mark.png" alt="SAGA" className="h-9 w-auto" />
          <span style={WORDMARK} className="text-2xl font-bold tracking-tight text-[#2A2433]">SAGA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/#features" className="text-[#6B6475] hover:text-[#2A2433] transition font-medium">Features</Link>
          <Link href="/demo" className="text-[#6B6475] hover:text-[#2A2433] transition font-medium">Live Demo</Link>
          <Link href="/about" className="text-[#6B6475] hover:text-[#2A2433] transition font-medium">About</Link>
          <Link href="/pricing" className="text-[#6B6475] hover:text-[#2A2433] transition font-medium">Pricing</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[#6B6475] hover:text-[#2A2433] transition font-medium">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-white font-semibold rounded-lg hover:opacity-95 transition-all"
            style={{ background: SUNSET }}
          >
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  )
}
