"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * OPTION 1: "MIDNIGHT PROFESSIONAL"
 *
 * DESIGN PHILOSOPHY:
 * - Sophisticated dark theme matching your dramatic homepage
 * - Glassmorphism with semi-transparent cards
 * - Purple/coral gradient accents from SAGA brand
 * - Professional yet modern aesthetic
 *
 * FULL CRM THEME:
 * - Dark sidebar navigation (#1a1a2e background)
 * - Semi-transparent cards with backdrop blur
 * - Purple (#764ba2) and coral (#ff6b6b) accent colors
 * - White text with varying opacity for hierarchy
 * - Gradient buttons and CTAs
 * - Glassmorphic data tables and forms
 * - Dark charts with vibrant accent colors
 */

export default function LoginOption1Midnight() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add your auth logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#764ba2] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff6b6b] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Image
              src="/SAGA_Logo_final.png"
              alt="SAGA CRM"
              width={400}
              height={160}
              className="h-32 w-auto opacity-95"
              style={{
                mixBlendMode: 'lighten',
                filter: 'contrast(1.1) saturate(1.2)'
              }}
              priority
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-white/60">
              Sign in to continue to your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-[#ffa07a] hover:text-[#ff6b6b] transition-colors">
                  Forgot?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#764ba2] focus:ring-[#764ba2]"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-white/70">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#764ba2] to-[#667eea] text-white font-semibold rounded-lg hover:from-[#8b5fb8] hover:to-[#7d8ff5] focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#ffa07a] hover:text-[#ff6b6b] font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/40">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
}
