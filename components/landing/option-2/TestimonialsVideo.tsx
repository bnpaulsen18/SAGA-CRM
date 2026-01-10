/**
 * OPTION 2: Emotional Impact Testimonials Section
 * Video-style testimonials with rich storytelling
 */

import { Play, Quotes } from '@phosphor-icons/react/dist/ssr'

const testimonials = [
  {
    quote: "Before SAGA, we were losing track of donors in endless spreadsheets. Now, we've increased our donor retention by 45% and our team actually enjoys using our CRM. It's been transformational.",
    author: "Dr. Maria Santos",
    role: "Executive Director",
    organization: "Global Health Initiative",
    impact: "$1.2M raised in first year",
    videoPlaceholder: true,
  },
  {
    quote: "As a small nonprofit with a team of 3, we needed something powerful but simple. SAGA gave us enterprise features without the enterprise complexity. Our donors notice the difference.",
    author: "James Williams",
    role: "Founder & CEO",
    organization: "Clean Water Project",
    impact: "300% increase in recurring donors",
    videoPlaceholder: true,
  },
  {
    quote: "The AI-powered insights have changed how we approach fundraising. SAGA tells us exactly when to reach out, what to say, and how to personalize each interaction. It's like having a fundraising coach on our team.",
    author: "Aisha Patel",
    role: "Development Director",
    organization: "Education for All Foundation",
    impact: "Record-breaking campaign: $850K",
    videoPlaceholder: true,
  },
]

export default function TestimonialsVideo() {
  return (
    <section
      className="py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgba(74, 25, 66, 0.05), rgba(255, 107, 53, 0.05))',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2
            className="text-5xl md:text-6xl font-bold text-[#1D3557] leading-tight mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Stories of{' '}
            <span className="bg-gradient-to-r from-[#4A1942] to-[#FF6B35] bg-clip-text text-transparent">
              transformation
            </span>
          </h2>
          <p className="text-xl text-[#6C757D] leading-relaxed">
            Real nonprofits. Real results. Real impact.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              {/* Video thumbnail */}
              <div
                className="aspect-video rounded-2xl mb-6 relative overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-350"
                style={{
                  background: 'linear-gradient(135deg, #4A1942 0%, #E63946 50%, #FF6B35 100%)',
                }}
              >
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-350">
                    <Play size={32} weight="fill" className="text-[#4A1942] ml-1" />
                  </div>
                </div>

                {/* Author overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="font-semibold text-white text-lg">
                    {testimonial.author}
                  </p>
                  <p className="text-white/80 text-sm">
                    {testimonial.role}, {testimonial.organization}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="mb-4">
                <Quotes size={32} weight="fill" className="text-[#FF6B35] mb-3" />
                <p className="text-lg text-[#1D3557] leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Impact metric */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: 'linear-gradient(to right, rgba(74, 25, 66, 0.1), rgba(255, 107, 53, 0.1))',
                  border: '1px solid rgba(255, 107, 53, 0.3)',
                  color: '#4A1942'
                }}
              >
                🎯 {testimonial.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
