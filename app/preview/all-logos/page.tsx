/**
 * All Logo Options Preview Page
 * View all 10 SAGA logo design directions
 * Access at: /preview/all-logos
 */

import {
  SagaLogoPrimary,
  SagaLogoDark,
  SagaLogoLight,
  SagaIcon,
  SagaLogoCompact,
  SagaLogoGeometric,
  SagaLogoClassic,
  SagaLogoFriendly,
  SagaLogoBold,
  SagaLogoElegant
} from '@/components/logos'

export const metadata = {
  title: 'SAGA CRM - All Logo Options',
  description: 'Preview all 10 professional logo design directions',
}

const originalLogos = [
  {
    name: 'Primary Full Wordmark',
    component: () => <SagaLogoPrimary width={250} />,
    description: 'Main gradient logo with swoosh accent',
    useCase: 'Website header, marketing materials',
    palette: 'Purple → Orange gradient (#764ba2 → #ff6b35)',
    audience: 'General / All audiences'
  },
  {
    name: 'Monochrome Dark',
    component: () => <SagaLogoDark width={240} />,
    description: 'Single color navy for light backgrounds',
    useCase: 'Partner grids, print materials',
    palette: 'Navy (#0F1419)',
    audience: 'Professional / Print'
  },
  {
    name: 'Monochrome Light',
    component: () => <SagaLogoLight width={240} />,
    description: 'White version for dark backgrounds',
    useCase: 'Dark mode UI, presentations',
    palette: 'White (#FFFFFF)',
    audience: 'Dark theme applications'
  },
  {
    name: 'Icon Only (Square)',
    component: () => <SagaIcon size={96} variant="gradient" />,
    description: 'Square icon for favicons and avatars',
    useCase: 'Favicon, app icons, social media',
    palette: 'Gradient background',
    audience: 'Digital / Apps'
  },
  {
    name: 'Compact Horizontal',
    component: () => <SagaLogoCompact width={160} />,
    description: 'Compact for navigation bars',
    useCase: 'Nav bars, mobile headers',
    palette: 'Purple → Orange gradient',
    audience: 'UI navigation'
  },
]

const newLogos = [
  {
    name: 'Modern Geometric',
    component: () => <SagaLogoGeometric width={220} colorScheme="gradient" />,
    description: 'Tech-forward, data-driven, minimalist',
    useCase: 'Tech-savvy nonprofits, SaaS marketing',
    palette: 'Cool blues & teals (#0A4D68 → #00D9FF)',
    audience: 'Tech startups, digital-first orgs',
    icon: () => <SagaLogoGeometric width={80} variant="icon-only" />
  },
  {
    name: 'Classic Serif Professional',
    component: () => <SagaLogoClassic width={200} colorScheme="navy-gold" showFoundingYear />,
    description: 'Timeless, traditional, institutional',
    useCase: 'Universities, hospitals, legacy nonprofits',
    palette: 'Navy & gold (#0F2347, #C5A572)',
    audience: 'Established institutions, boards',
    icon: () => <SagaLogoClassic width={80} variant="shield-only" />
  },
  {
    name: 'Friendly Rounded',
    component: () => <SagaLogoFriendly width={220} colorScheme="rainbow-gradient" playful />,
    description: 'Approachable, warm, community-focused',
    useCase: 'Community orgs, youth programs',
    palette: 'Warm rainbow (coral, yellow, teal)',
    audience: 'Local nonprofits, family services',
    icon: () => <SagaLogoFriendly width={80} variant="icon-only" />
  },
  {
    name: 'Bold Impact',
    component: () => <SagaLogoBold width={240} colorScheme="gradient" showImpactLine />,
    description: 'Dramatic, high-energy, activist',
    useCase: 'Social justice, advocacy campaigns',
    palette: 'Deep purple → magenta → orange',
    audience: 'Activists, movement builders',
    icon: () => <SagaLogoBold width={80} variant="icon-only" />
  },
  {
    name: 'Elegant Minimal',
    component: () => <SagaLogoElegant width={220} colorScheme="gold" weight="ultra-light" showAccentDot />,
    description: 'Sophisticated, upscale, refined',
    useCase: 'Gala invitations, major donor materials',
    palette: 'Charcoal & gold (#2B2D2F, #D4AF37)',
    audience: 'High-net-worth donors, galas',
    icon: () => <SagaLogoElegant width={80} variant="icon-only" />
  },
]

export default function AllLogosPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SAGA CRM Logo System
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            10 professional logo options for every brand direction
          </p>
          <p className="text-gray-500">
            Original 5 variations + 5 new design directions targeting different audiences
          </p>
        </div>

        {/* Original 5 Variations */}
        <section className="mb-20">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Original Logo System
            </h2>
            <p className="text-gray-600">
              Established SAGA brand identity with 5 versatile variations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {originalLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Logo Display */}
                <div className={`${
                  logo.name.includes('Light')
                    ? 'bg-[#0F1419]'
                    : 'bg-gradient-to-br from-gray-50 to-white'
                } p-12 border-b border-gray-200 flex items-center justify-center min-h-[200px]`}>
                  {logo.component()}
                </div>

                {/* Logo Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {logo.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {logo.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">Use Case:</span>
                      <p className="text-gray-600">{logo.useCase}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Palette:</span>
                      <p className="text-gray-600">{logo.palette}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Audience:</span>
                      <p className="text-gray-600">{logo.audience}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New 5 Design Directions */}
        <section className="mb-20">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              5 New Design Directions
            </h2>
            <p className="text-gray-600">
              Completely different brand personalities targeting specific audiences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10">
            {newLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Logo Display */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-white p-12 border-r border-gray-200">
                    <div className="flex items-center justify-center mb-8">
                      {logo.component()}
                    </div>
                    {/* Icon Version */}
                    <div className="flex items-center justify-center gap-8 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-2">Icon Version</p>
                        {logo.icon && logo.icon()}
                      </div>
                    </div>
                  </div>

                  {/* Logo Details */}
                  <div className="p-8 bg-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-orange-500" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        {logo.name}
                      </h3>
                    </div>

                    <p className="text-gray-700 font-medium mb-6">
                      {logo.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Primary Use Case
                        </div>
                        <p className="text-gray-800">{logo.useCase}</p>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Color Palette
                        </div>
                        <p className="text-gray-800 text-sm font-mono">
                          {logo.palette}
                        </p>
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Target Audience
                        </div>
                        <p className="text-gray-800">{logo.audience}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Recommendation Guide */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl shadow-lg p-10 text-white">
            <h2 className="text-3xl font-bold mb-6">Which Logo Should You Use?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">By Organization Type</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Tech Startups / Digital-First</p>
                    <p className="text-white/90">→ Modern Geometric</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Universities / Hospitals</p>
                    <p className="text-white/90">→ Classic Serif Professional</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Community / Youth Programs</p>
                    <p className="text-white/90">→ Friendly Rounded</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Advocacy / Social Justice</p>
                    <p className="text-white/90">→ Bold Impact</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Galas / Major Donors</p>
                    <p className="text-white/90">→ Elegant Minimal</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">By Marketing Goal</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Build Trust & Credibility</p>
                    <p className="text-white/90">→ Classic or Primary</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Show Innovation</p>
                    <p className="text-white/90">→ Geometric</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Increase Approachability</p>
                    <p className="text-white/90">→ Friendly</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Create Urgency</p>
                    <p className="text-white/90">→ Bold Impact</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold">Attract High-Value Donors</p>
                    <p className="text-white/90">→ Elegant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-600">
          <p className="mb-2">
            See{' '}
            <a href="/LOGO-VARIATIONS.md" className="text-purple-600 hover:underline font-medium">
              LOGO-VARIATIONS.md
            </a>
            {' '}for complete documentation and implementation guide
          </p>
          <p className="text-sm text-gray-500">
            All logos are React SVG components • Fully customizable • Type-safe
          </p>
        </div>
      </div>
    </div>
  )
}
