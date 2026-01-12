/**
 * OPTION 2: Emotional Impact Features Section
 * Alternating image/text blocks with gradient accents
 */

import {
  Heart,
  ChartLineUp,
  Users,
  Lightning
} from '@phosphor-icons/react/dist/ssr'

const features = [
  {
    icon: Heart,
    iconColor: 'text-pink-400',
    title: 'Build relationships, not just databases',
    description: 'See the full story behind every donor—their passions, their giving journey, and the impact they\'ve made. Our AI-powered insights help you understand what matters most to each supporter.',
    benefits: [
      'Automated donor engagement scoring',
      'Personal giving history timelines',
      'Smart communication recommendations',
      'Anniversary and milestone tracking'
    ],
    imagePlaceholder: 'Contact relationship view'
  },
  {
    icon: ChartLineUp,
    iconColor: 'text-orange-400',
    title: 'Watch your impact grow in real-time',
    description: 'Beautiful dashboards that tell your fundraising story. Track campaign progress, measure donor retention, and celebrate milestones with your team—all at a glance.',
    benefits: [
      'Live campaign progress tracking',
      'Donor retention analytics',
      'Automated impact reports',
      'Year-over-year growth visualization'
    ],
    imagePlaceholder: 'Analytics dashboard'
  },
  {
    icon: Users,
    iconColor: 'text-teal-400',
    title: 'Your entire team, on the same page',
    description: 'From development directors to board members, everyone gets the insights they need. Share wins, track outreach, and coordinate campaigns—no more siloed spreadsheets.',
    benefits: [
      'Role-based access and permissions',
      'Team activity feed',
      'Collaborative donor notes',
      'Shared campaign calendars'
    ],
    imagePlaceholder: 'Team collaboration view'
  },
  {
    icon: Lightning,
    iconColor: 'text-yellow-400',
    title: 'Set up in minutes, not months',
    description: 'Import your existing donor data, customize your workflow, and send your first email—all before your coffee gets cold. No IT team required.',
    benefits: [
      'One-click CSV import',
      'Pre-built email templates',
      'Guided onboarding wizard',
      'Free white-glove migration'
    ],
    imagePlaceholder: 'Quick setup flow'
  },
]

export default function FeaturesAlternating() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-[1400px] mx-auto px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2
            className="text-5xl md:text-6xl font-bold text-[#1D3557] leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Fundraising tools that{' '}
            <span className="bg-gradient-to-r from-[#4A1942] to-[#FF6B35] bg-clip-text text-transparent">
              feel like magic
            </span>
          </h2>
          <p className="text-xl text-[#6C757D] leading-relaxed">
            Everything you need to turn one-time givers into lifelong supporters.
          </p>
        </div>

        {/* Alternating feature blocks */}
        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isEven = index % 2 === 0

            return (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                  isEven ? '' : 'lg:grid-flow-dense'
                }`}
              >
                {/* Text content */}
                <div className={isEven ? '' : 'lg:col-start-2'}>
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A1942]/10 to-[#FF6B35]/10 flex items-center justify-center mb-6`}
                  >
                    <Icon size={32} weight="bold" className={feature.iconColor} />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-4"
                      style={{ letterSpacing: '-0.01em' }}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-[#6C757D] leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  {/* Benefits list */}
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg
                          className="w-6 h-6 text-[#FF6B35] flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-base text-[#1D3557]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image placeholder */}
                <div className={isEven ? 'lg:col-start-2' : ''}>
                  <div
                    className="aspect-video rounded-3xl overflow-hidden shadow-2xl"
                    style={{
                      background: 'linear-gradient(to bottom right, rgba(74, 25, 66, 0.05), rgba(255, 107, 53, 0.05))',
                      border: '1px solid rgba(255, 107, 53, 0.2)'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {feature.imagePlaceholder}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
