/**
 * Brand Icon Marks Preview Page
 * View all 5 marketing-focused icon-only logos
 * Access at: /preview/brand-icons
 */

import {
  HeartGrowthIcon,
  ConnectedHandsIcon,
  RisingGraphShieldIcon,
  CircularFlowIcon,
  TreeOfGivingIcon
} from '@/components/brand-icons'

export const metadata = {
  title: 'SAGA CRM - Brand Icon Marks',
  description: 'Preview 5 professional icon-only logo marks for marketing campaigns',
}

const icons = [
  {
    name: 'Heart + Growth',
    component: HeartGrowthIcon,
    symbolism: 'Mission-driven growth and fundraising momentum',
    useCase: 'Emotional storytelling, donor impact reports, mission-focused campaigns',
    bestFor: 'Individual donors, grassroots nonprofits, faith-based organizations',
    marketingMessage: 'Growth driven by heart. Where mission meets momentum.',
    colorScheme: 'Purple to Orange gradient',
  },
  {
    name: 'Connected Hands',
    component: ConnectedHandsIcon,
    symbolism: 'Donor-nonprofit relationship, giving, community partnership',
    useCase: 'Relationship-focused messaging, stewardship campaigns, donor retention',
    bestFor: 'Major gift officers, monthly donors, peer-to-peer fundraising',
    marketingMessage: 'Building relationships, not just transactions.',
    colorScheme: 'Purple to Orange gradient',
  },
  {
    name: 'Rising Graph + Shield',
    component: RisingGraphShieldIcon,
    symbolism: 'Security, trust, data-driven growth, enterprise analytics',
    useCase: 'Enterprise positioning, compliance messaging, security features',
    bestFor: 'Large nonprofits, universities, healthcare foundations, enterprise buyers',
    marketingMessage: 'Secure growth through trusted insights.',
    colorScheme: 'Purple to Orange gradient',
  },
  {
    name: 'Circular Flow',
    component: CircularFlowIcon,
    symbolism: 'Donor lifecycle, recurring donations, continuous engagement',
    useCase: 'Retention campaigns, monthly giving, lifecycle marketing',
    bestFor: 'Recurring revenue focus, subscription giving, annual fund directors',
    marketingMessage: 'Keep donors engaged, giving, and growing.',
    colorScheme: 'Purple to Orange gradient',
  },
  {
    name: 'Tree of Giving',
    component: TreeOfGivingIcon,
    symbolism: 'Sustainable growth, deep community roots, expanding impact',
    useCase: 'Impact-focused messaging, sustainability reports, legacy giving',
    bestFor: 'Environmental nonprofits, community foundations, long-term impact',
    marketingMessage: 'Rooted in purpose. Growing impact.',
    colorScheme: 'Vertical gradient (roots to branches)',
  },
]

export default function BrandIconsPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SAGA CRM Brand Icon System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            5 marketing-focused icon-only logos for different brand stories
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              No Text/Wordmark
            </span>
            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              Marketing Specialist Designed
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              Multi-Context Usage
            </span>
          </div>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {icons.map((icon, index) => {
            const IconComponent = icon.component
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Icon Display */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-12 border-b border-gray-200">
                  <div className="flex items-center justify-center">
                    <IconComponent size={128} variant="gradient" />
                  </div>
                </div>

                {/* Icon Details */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {icon.name}
                  </h2>

                  {/* Symbolism */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      Symbolism
                    </h3>
                    <p className="text-gray-600">{icon.symbolism}</p>
                  </div>

                  {/* Marketing Message */}
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg border border-purple-100">
                    <p className="text-purple-900 font-medium italic">
                      "{icon.marketingMessage}"
                    </p>
                  </div>

                  {/* Use Case */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      Use Case
                    </h3>
                    <p className="text-gray-600 text-sm">{icon.useCase}</p>
                  </div>

                  {/* Best For */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      Best For
                    </h3>
                    <p className="text-gray-600 text-sm">{icon.bestFor}</p>
                  </div>

                  {/* Size Variations */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Size Scale
                    </h3>
                    <div className="flex items-end justify-between gap-4 bg-gray-50 rounded-lg p-4">
                      <div className="text-center">
                        <IconComponent size={32} variant="gradient" />
                        <p className="text-xs text-gray-500 mt-2">32px</p>
                      </div>
                      <div className="text-center">
                        <IconComponent size={48} variant="gradient" />
                        <p className="text-xs text-gray-500 mt-2">48px</p>
                      </div>
                      <div className="text-center">
                        <IconComponent size={64} variant="gradient" />
                        <p className="text-xs text-gray-500 mt-2">64px</p>
                      </div>
                      <div className="text-center">
                        <IconComponent size={96} variant="gradient" />
                        <p className="text-xs text-gray-500 mt-2">96px</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Color Variations Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Color Variations
            </h2>
            <p className="text-gray-600 mb-8">
              Each icon supports gradient and monochrome variants for different contexts
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Gradient */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Gradient (Default)
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 mb-3">
                  <div className="flex justify-center">
                    <HeartGrowthIcon size={80} variant="gradient" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Primary brand applications, digital marketing
                </p>
              </div>

              {/* Purple Monochrome */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Purple Monochrome
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 mb-3">
                  <div className="flex justify-center">
                    <HeartGrowthIcon size={80} variant="monochrome" monochromeColor="#764ba2" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Print materials, professional documents
                </p>
              </div>

              {/* Orange Monochrome */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Orange Monochrome
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 mb-3">
                  <div className="flex justify-center">
                    <HeartGrowthIcon size={80} variant="monochrome" monochromeColor="#ff6b35" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Accent usage, CTAs, high-energy campaigns
                </p>
              </div>
            </div>

            {/* Dark Background */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                On Dark Backgrounds
              </h3>
              <div className="bg-[#0F1419] rounded-lg p-8">
                <div className="flex justify-around items-center">
                  <HeartGrowthIcon size={64} variant="monochrome" monochromeColor="#FFFFFF" />
                  <ConnectedHandsIcon size={64} variant="monochrome" monochromeColor="#FFFFFF" />
                  <RisingGraphShieldIcon size={64} variant="monochrome" monochromeColor="#FFFFFF" />
                  <CircularFlowIcon size={64} variant="monochrome" monochromeColor="#FFFFFF" />
                  <TreeOfGivingIcon size={64} variant="monochrome" monochromeColor="#FFFFFF" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                White monochrome for dark mode UI, presentations, video overlays
              </p>
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Marketing Usage Guide</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* When to Use Each Icon */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">When to Use Each Icon</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold">Heart + Growth</p>
                    <p className="text-white/80">Emotional campaigns, impact stories</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold">Connected Hands</p>
                    <p className="text-white/80">Donor retention, relationships</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold">Rising Graph + Shield</p>
                    <p className="text-white/80">Enterprise sales, security features</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold">Circular Flow</p>
                    <p className="text-white/80">Recurring giving, lifecycle marketing</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="font-semibold">Tree of Giving</p>
                    <p className="text-white/80">Legacy giving, long-term impact</p>
                  </div>
                </div>
              </div>

              {/* Code Example */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Quick Start Code</h3>
                <div className="bg-black/20 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-white/90">
{`import {
  HeartGrowthIcon,
  CircularFlowIcon
} from '@/components/brand-icons'

// Gradient (default)
<HeartGrowthIcon size={64} />

// Monochrome purple
<CircularFlowIcon
  size={80}
  variant="monochrome"
  monochromeColor="#764ba2"
/>

// White for dark bg
<HeartGrowthIcon
  size={64}
  variant="monochrome"
  monochromeColor="#FFFFFF"
/>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>
            See{' '}
            <a href="/BRAND-ICONS.md" className="text-purple-600 hover:underline">
              BRAND-ICONS.md
            </a>
            {' '}for complete documentation and marketing guidelines
          </p>
        </div>
      </div>
    </div>
  )
}
