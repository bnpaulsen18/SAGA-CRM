/**
 * OPTION 1: Trust-First Minimalist Testimonials Section
 * Clean, professional testimonial cards with photos
 */

import Image from 'next/image'
import { Star } from '@phosphor-icons/react/dist/ssr'

const testimonials = [
  {
    quote: "SAGA transformed how we manage our donor relationships. We've seen a 40% increase in repeat donations since switching.",
    author: "Sarah Chen",
    role: "Development Director",
    organization: "Community Arts Foundation",
    rating: 5,
  },
  {
    quote: "The simplicity is what sold us. Our small team was up and running in under an hour, and the donor insights are incredible.",
    author: "Michael Rodriguez",
    role: "Executive Director",
    organization: "Youth Education Initiative",
    rating: 5,
  },
  {
    quote: "Finally, a CRM that doesn't require a manual to use. SAGA's intuitive design means our entire team actually uses it.",
    author: "Jennifer Park",
    role: "Fundraising Manager",
    organization: "Environmental Justice Coalition",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-[2.5rem] font-bold text-[#2C3E50] leading-tight mb-6"
              style={{ letterSpacing: '-0.01em' }}>
            Trusted by fundraising professionals
          </h2>
          <p className="text-lg text-[#7F8C8D] leading-relaxed">
            See what nonprofit leaders are saying about SAGA CRM.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow duration-250"
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} weight="fill" className="text-[#F4A261]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base text-[#2C3E50] leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-start gap-3">
                {/* Placeholder avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#764ba2] to-[#FF6B6B] flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>

                <div>
                  <p className="font-semibold text-[#2C3E50] text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-[#7F8C8D]">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-[#BDC3C7]">
                    {testimonial.organization}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
