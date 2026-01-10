/**
 * Landing Page Navigation (Shared across all options)
 * Clean, minimal navigation with SAGA logo
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { useState } from 'react'

interface LandingNavProps {
  variant?: 'light' | 'dark'
}

export default function LandingNav({ variant = 'light' }: LandingNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isDark = variant === 'dark'

  return (
    <nav className={`sticky top-0 z-50 ${isDark ? 'bg-[#0F1419] border-white/10' : 'bg-white border-gray-200'} border-b backdrop-blur-sm`}>
      <div className="max-w-[1200px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/SAGA_Logo_transparent.png"
              alt="SAGA CRM"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className={`text-sm font-medium ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className={`text-sm font-medium ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className={`text-sm font-medium ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Pricing
            </Link>

            <Link
              href="/login"
              className={`text-sm font-medium ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            >
              Sign In
            </Link>

            <Link
              href="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-[#764ba2] to-[#FF6B6B] text-white text-sm font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-250 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pt-4 pb-2 ${isDark ? 'border-white/10' : 'border-gray-200'} border-t mt-4`}>
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-[#764ba2] to-[#FF6B6B] text-white text-sm font-semibold rounded-lg shadow text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
