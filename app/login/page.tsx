"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const verified = searchParams.get("verified");
  const reset = searchParams.get("reset");

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

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An error occurred during login");
      setLoading(false);
    }
  };

  const bricolage = { fontFamily: "var(--font-bricolage), sans-serif" } as const;
  const sunset = "linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)";

  return (
    <div className="min-h-screen flex bg-[#FAF6EF] text-[#2A2433]">
      {/* Left — Brand (desktop/tablet only) */}
      <div className="hidden md:flex md:w-1/2 bg-[#F4EFE6] border-r border-[#E8E1D7] p-12 flex-col justify-between relative overflow-hidden">
        {/* single subtle sunset accent */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: sunset }}
        />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <img src="/SAGA_mark.png" alt="SAGA" style={{ height: 44, width: "auto", display: "block" }} />
            <span style={bricolage} className="text-2xl font-bold tracking-tight text-[#2A2433]">
              SAGA
            </span>
          </div>

          {/* Mission */}
          <div className="max-w-lg">
            <h2 style={bricolage} className="text-4xl font-bold mb-6 leading-tight text-[#2A2433]">
              Every donor has a story.
              <br />
              <span
                style={{
                  background: "linear-gradient(105deg,#F97A5E,#E0507A 60%,#5B4B8A)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Every story matters.
              </span>
            </h2>
            <p className="text-[#6B6475] text-lg leading-relaxed mb-10">
              The AI-native CRM that helps nonprofits build deeper donor relationships,
              automate the busywork, and amplify their mission.
            </p>

            {/* Honest value props (no fabricated numbers) */}
            <div className="space-y-3">
              {[
                ["AI-powered donor insights", "See who to thank, re-engage, and ask next."],
                ["Automated gifts & receipts", "Tax receipts and workflows handled for you."],
                ["Bank-grade security", "Encryption, audit trails, and role-based access."],
              ].map(([title, desc]) => (
                <div key={title} className="flex items-start gap-3 bg-white border border-[#E8E1D7] rounded-xl p-4">
                  <div className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#F6EBE6]">
                    <svg className="w-4 h-4 text-[#E0507A]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-[#2A2433] text-sm">{title}</p>
                    <p className="text-[#6B6475] text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[#9A93A3] text-sm">
          © {new Date().getFullYear()} SAGA. Built for nonprofits.
        </p>
      </div>

      {/* Right — Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#FAF6EF]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden mb-8 flex items-center justify-center gap-3">
            <img src="/SAGA_mark.png" alt="SAGA" style={{ height: 40, width: "auto" }} />
            <span style={bricolage} className="text-2xl font-bold tracking-tight">SAGA</span>
          </div>

          <div className="mb-8">
            <h1 style={bricolage} className="text-3xl font-bold mb-2 text-[#2A2433]">Welcome back</h1>
            <p className="text-[#6B6475]">Sign in to continue to your dashboard</p>
          </div>

          <div className="bg-white border border-[#E8E1D7] rounded-2xl p-8">
            {registered && (
              <div className="mb-6 rounded-lg p-4 bg-[#E6F3EE] border border-[#CDE9DD]">
                <p className="text-[#2E7D5B] text-sm">
                  Registration successful! Check your email to verify your account before signing in.
                </p>
              </div>
            )}
            {verified && (
              <div className="mb-6 rounded-lg p-4 bg-[#E6F3EE] border border-[#CDE9DD]">
                <p className="text-[#2E7D5B] text-sm">Email verified! You can now sign in.</p>
              </div>
            )}
            {reset === "success" && (
              <div className="mb-6 rounded-lg p-4 bg-[#E6F3EE] border border-[#CDE9DD]">
                <p className="text-[#2E7D5B] text-sm">Password reset successful! Sign in with your new password.</p>
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-lg p-4 bg-[#F6EBE6] border border-[#EAD3C8]">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-[#C0573F]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[#C0573F] text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#2A2433] mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#E8E1D7] rounded-lg text-[#2A2433] placeholder-[#9A93A3] focus:outline-none focus:ring-2 focus:ring-[#5B4B8A] focus:border-transparent transition-all"
                  placeholder="you@organization.org"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[#2A2433]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-sm font-medium text-[#5B4B8A] hover:text-[#E0507A] transition-colors">
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
                  className="w-full px-4 py-3 bg-[#FAF6EF] border border-[#E8E1D7] rounded-lg text-[#2A2433] placeholder-[#9A93A3] focus:outline-none focus:ring-2 focus:ring-[#5B4B8A] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#E8E1D7] text-[#5B4B8A] focus:ring-[#5B4B8A]"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-[#6B6475]">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-95"
                style={{ background: sunset }}
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
                  "Sign in"
                )}
              </button>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E1D7]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#9A93A3]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-[#FAF6EF] border border-[#E8E1D7] rounded-lg text-[#2A2433] text-sm font-medium transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => signIn("azure-ad", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-[#FAF6EF] border border-[#E8E1D7] rounded-lg text-[#2A2433] text-sm font-medium transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Microsoft
              </button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-sm text-[#6B6475]">New to SAGA? </span>
              <Link href="/register" className="text-sm font-semibold text-[#5B4B8A] hover:text-[#E0507A] transition-colors">
                Create your free account →
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs text-[#6B6475] border border-[#E8E1D7]">
              <svg className="w-4 h-4 text-[#2E9D78]" fill="currentColor" viewBox="0 0 20 20">
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
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6EF]" />}>
      <LoginForm />
    </Suspense>
  );
}
