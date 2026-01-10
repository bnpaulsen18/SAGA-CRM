/**
 * OPTION 1: Trust-First Minimalist Features Section
 * Clean 3-column grid with Phosphor icons
 */

import {
  Users,
  CurrencyDollar,
  ChartBar,
  Envelope,
  FileText,
  Lock
} from '@phosphor-icons/react/dist/ssr'

const features = [
  {
    icon: Users,
    title: 'Contact Management',
    description: 'Centralize donor information with detailed profiles, giving history, and engagement tracking.',
  },
  {
    icon: CurrencyDollar,
    title: 'Donation Tracking',
    description: 'Record every gift, manage recurring donations, and generate tax receipts automatically.',
  },
  {
    icon: ChartBar,
    title: 'Campaign Analytics',
    description: 'Track fundraising progress in real-time with beautiful dashboards and custom reports.',
  },
  {
    icon: Envelope,
    title: 'Email Integration',
    description: 'Send personalized thank-you emails and campaign updates directly from the platform.',
  },
  {
    icon: FileText,
    title: 'Custom Reports',
    description: 'Generate comprehensive reports for board meetings, grant applications, and audits.',
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    description: 'Bank-level encryption, GDPR compliance, and role-based access control built-in.',
  },
]

export default function FeaturesGrid() {
  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-[2.5rem] font-bold text-[#2C3E50] leading-tight mb-6"
              style={{ letterSpacing: '-0.01em' }}>
            Everything you need to manage donors effectively
          </h2>
          <p className="text-lg text-[#7F8C8D] leading-relaxed">
            Powerful features designed specifically for nonprofit fundraising teams. Simple enough to start using today.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-250"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#764ba2] to-[#FF6B6B] flex items-center justify-center mb-5">
                  <Icon size={24} weight="bold" className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-base text-[#7F8C8D] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
