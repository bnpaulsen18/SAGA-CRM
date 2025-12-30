"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

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
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Successful login, redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Story (Tablet/Desktop Only - Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#764ba2] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff6b6b] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ffa07a] opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-16">
            <img
              src="/SAGA_Logo_final.png"
              alt="SAGA CRM"
              style={{
                height: '100px',
                width: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 8px 24px rgba(118, 75, 162, 0.4)) drop-shadow(0 4px 12px rgba(255, 107, 107, 0.35)) brightness(1.12) contrast(1.16) saturate(1.08)',
                opacity: '0.98'
              }}
            />
          </div>

          {/* Mission Statement */}
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Every donor has a story.
              <br />
              <span className="bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent">
                Every story matters.
              </span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Join 10,000+ nonprofits using SAGA to build meaningful relationships,
              automate workflows, and amplify their impact with AI-powered insights.
            </p>

            {/* Stats - Glassmorphic Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-1">
                  $500M+
                </div>
                <div className="text-white/70 text-sm">Raised</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-1">
                  10K+
                </div>
                <div className="text-white/70 text-sm">Nonprofits</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#ffa07a] to-[#ff6b6b] bg-clip-text text-transparent mb-1">
                  98%
                </div>
                <div className="text-white/70 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-[#ff6b6b] to-[#ffa07a] rounded-full flex items-center justify-center text-2xl shadow-lg">
                💙
              </div>
            </div>
            <div>
              <p className="text-white/90 mb-3 italic leading-relaxed">
                "SAGA transformed how we connect with our donors. We've increased retention by 35% in just 6 months."
              </p>
              <p className="text-white/70 text-sm font-medium">
                — Sarah Chen, Hope Foundation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form (Full width on mobile, half width on tablet/desktop) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] md:from-[#0f1419] md:via-[#1a1a2e] md:to-[#16213e] flex items-center justify-center p-8 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#764ba2] opacity-10 rounded-full blur-3xl md:opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff6b6b] opacity-10 rounded-full blur-3xl md:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo (Hidden on tablet/desktop) */}
          <div className="md:hidden mb-8 flex justify-center">
            <img
              src="/SAGA_Logo_final.png"
              alt="SAGA CRM"
              style={{
                height: '80px',
                width: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 8px 24px rgba(118, 75, 162, 0.4)) drop-shadow(0 4px 12px rgba(255, 107, 107, 0.35)) brightness(1.12) contrast(1.16) saturate(1.08)',
                opacity: '0.98'
              }}
            />
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-white/60">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
            {/* Success Message */}
            {registered && (
              <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-200 text-sm">
                  Registration successful! Please sign in with your credentials.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-all"
                    placeholder="you@organization.org"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-white/90">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm text-[#ffa07a] hover:text-[#ff6b6b] transition-colors font-medium">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-white/40" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#764ba2] focus:ring-[#764ba2] focus:ring-offset-[#1a1a2e]"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-white/70">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#764ba2] via-[#667eea] to-[#667eea] text-white font-semibold rounded-lg hover:from-[#8b5fb8] hover:via-[#7d8ff5] hover:to-[#7d8ff5] focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:ring-offset-2 focus:ring-offset-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:shadow-[#764ba2]/30 hover:-translate-y-0.5"
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

            {/* Sign Up Link */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/50">New to SAGA?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/register"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Create your free account{" "}
                  <span className="text-[#ffa07a] hover:text-[#ff6b6b] font-semibold">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-xs text-white/50 border border-white/10">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Protected by enterprise-grade security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
