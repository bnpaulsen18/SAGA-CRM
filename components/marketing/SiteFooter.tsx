import Link from 'next/link'
import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import EmailCaptureForm from '@/components/landing/shared/EmailCaptureForm'

const SUNSET = 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)'
const WORDMARK = { fontFamily: 'var(--font-bricolage), sans-serif' } as const

/**
 * Shared marketing-site footer. Every link here resolves to a real page —
 * unbuilt sections (Careers, Blog, Docs, etc.) were intentionally cut rather
 * than left as dead `#` anchors.
 */
export default function SiteFooter() {
  return (
    <footer className="py-16 border-t border-[#E8E1D7] bg-[#F4EFE6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter */}
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6" style={{ background: SUNSET }}>
            <EnvelopeSimple size={24} weight="bold" className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-[#2A2433] mb-3">Stay Updated</h3>
          <p className="text-[#6B6475] mb-8">
            Get nonprofit fundraising tips, product updates, and success stories delivered to your inbox.
          </p>
          <EmailCaptureForm variant="light" size="large" source="site_footer" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
          {/* Company */}
          <div>
            <h4 className="text-[#2A2433] font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">About Us</Link></li>
              <li><Link href="/about#mission" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">Our Mission</Link></li>
              <li><Link href="/contact" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[#2A2433] font-bold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#features" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">Pricing</Link></li>
              <li><Link href="/security" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[#2A2433] font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#6B6475] hover:text-[#2A2433] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E8E1D7] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/SAGA_mark.png" alt="SAGA" className="h-7 w-auto" />
            <span style={WORDMARK} className="text-lg font-bold tracking-tight text-[#2A2433]">SAGA</span>
            <p className="text-[#9A93A3] text-sm">
              Built with love for nonprofits making a difference.
            </p>
          </div>
          <p className="text-[#9A93A3] text-sm">© {new Date().getFullYear()} SAGA CRM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
