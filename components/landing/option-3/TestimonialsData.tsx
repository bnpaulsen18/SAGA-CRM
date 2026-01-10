/**
 * OPTION 3: Enterprise Data-Driven Testimonials Section
 * Data-focused testimonials with metrics
 */

import { TrendUp, Users, CurrencyDollar } from '@phosphor-icons/react/dist/ssr'

const testimonials = [
  {
    quote: "SAGA scaled with us from 50K donors to over 200K. The performance is incredible—sub-second queries even with complex segmentation. Our data team loves the API access.",
    author: "Robert Chen",
    role: "VP of Development",
    organization: "National Education Fund",
    metric: "+300%",
    metricLabel: "Donor Growth",
    metricIcon: Users,
  },
  {
    quote: "We migrated from Salesforce and cut our CRM costs by 60% while gaining better features. The ROI was immediate. SAGA's nonprofit-specific workflows saved us countless hours.",
    author: "Linda Martinez",
    role: "CFO",
    organization: "Healthcare Foundation",
    metric: "$120K",
    metricLabel: "Annual Savings",
    metricIcon: CurrencyDollar,
  },
  {
    quote: "The predictive analytics helped us identify major gift prospects we would have missed. We secured three 6-figure gifts in Q1 alone. This platform pays for itself 100x over.",
    author: "David Park",
    role: "Chief Development Officer",
    organization: "Arts & Culture Institute",
    metric: "+42%",
    metricLabel: "Major Gifts",
    metricIcon: TrendUp,
  },
]

export default function TestimonialsData() {
  return (
    <section className="bg-[#F4F6F8] py-20 md:py-32">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2C3E50] leading-tight mb-6"
            style={{ letterSpacing: '-0.01em' }}
          >
            Proven results at enterprise scale
          </h2>
          <p className="text-lg text-[#566573] leading-relaxed">
            Leading nonprofits rely on SAGA for mission-critical fundraising operations.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            const MetricIcon = testimonial.metricIcon
            return (
              <div
                key={index}
                className="bg-white border border-[#D5DBDB] rounded-xl p-8 hover:shadow-lg transition-shadow duration-250"
              >
                {/* Metric highlight */}
                <div className="mb-6 pb-6 border-b border-[#D5DBDB]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#764ba2]/10 to-[#FF6B35]/10 flex items-center justify-center">
                      <MetricIcon size={20} weight="bold" className="text-[#764ba2]" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#2C3E50]">
                        {testimonial.metric}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#95A5A6] uppercase tracking-wide font-semibold">
                    {testimonial.metricLabel}
                  </p>
                </div>

                {/* Quote */}
                <p className="text-base text-[#566573] leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-start gap-3">
                  {/* Avatar with initials */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#764ba2] to-[#FF6B35] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div>
                    <p className="font-semibold text-[#2C3E50] text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-[#566573]">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-[#95A5A6]">
                      {testimonial.organization}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-[#D5DBDB]">
          <div className="text-center">
            <p className="text-4xl font-bold text-[#2C3E50] mb-2">99.9%</p>
            <p className="text-sm text-[#95A5A6]">Uptime SLA</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#2C3E50] mb-2">SOC 2</p>
            <p className="text-sm text-[#95A5A6]">Type II Certified</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#2C3E50] mb-2">24/7</p>
            <p className="text-sm text-[#95A5A6]">Enterprise Support</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-[#2C3E50] mb-2">GDPR</p>
            <p className="text-sm text-[#95A5A6]">Fully Compliant</p>
          </div>
        </div>
      </div>
    </section>
  )
}
