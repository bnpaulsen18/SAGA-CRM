import Link from "next/link";
import Image from "next/image";

// VERSION 1: "Minimalist Hero" - Logo-First, Story-Driven
// Focus: Let the SAGA logo be the hero, emphasize the tagline, clean minimal design
// Selling Point: Every nonprofit has a unique story - SAGA helps tell it

export default function HomeV1() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Minimal Header */}
      <header className="border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all text-sm border border-white/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero - Logo Takes Center Stage */}
      <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-8">
        <div className="text-center max-w-6xl">
          {/* Large Logo */}
          <div className="flex items-center justify-center mb-12">
            <Image
              src="/SAGA_Logo_final.png"
              alt="SAGA - every donor has a story"
              width={1200}
              height={480}
              className="h-80 w-auto opacity-95"
              style={{
                mixBlendMode: 'lighten',
                filter: 'contrast(1.1) saturate(1.2)'
              }}
              priority
            />
          </div>

          {/* AI Badge - Subtle */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/60 mb-8 border border-white/10">
            <span>✨</span>
            <span>AI-Powered Nonprofit CRM</span>
          </div>

          {/* Value Proposition */}
          <h2 className="text-4xl text-white mb-6 font-light max-w-3xl mx-auto leading-relaxed">
            Donor management built for{" "}
            <span className="font-semibold bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent">
              mission-driven organizations
            </span>
          </h2>

          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Track relationships, automate receipts, and understand your donors with AI-powered insights.
            Because every nonprofit deserves enterprise-level tools.
          </p>

          {/* Single Strong CTA */}
          <Link
            href="/register"
            className="inline-block px-12 py-4 bg-gradient-to-r from-[#ff6b6b] to-[#ffa07a] text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_8px_30px_rgba(255,107,107,0.5)] hover:-translate-y-1 transition-all text-lg"
          >
            Start Free Trial
          </Link>

          {/* Trust Signals - Minimal */}
          <div className="flex items-center justify-center gap-12 mt-16 text-sm text-white/40">
            <div>
              <span className="text-2xl font-bold text-white/70">10K+</span>
              <span className="ml-2">nonprofits</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="text-2xl font-bold text-white/70">$500M+</span>
              <span className="ml-2">raised</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="text-2xl font-bold text-white/70">98%</span>
              <span className="ml-2">satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
