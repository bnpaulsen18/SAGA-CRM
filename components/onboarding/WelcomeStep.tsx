'use client';

import { Rocket, Users, ChartLine, Sparkle } from '@phosphor-icons/react';

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-6 shadow-lg shadow-purple-500/50">
          <Rocket size={40} weight="duotone" className="text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
          Welcome to SAGA CRM!
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Let's get you set up in just 5 quick steps. We'll help you configure your organization,
          connect payment processing, and start building stronger donor relationships.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 mx-auto">
            <Users size={24} weight="duotone" className="text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Donor Management</h3>
          <p className="text-sm text-white/60">
            Track donors, donations, and interactions in one powerful platform
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4 mx-auto">
            <ChartLine size={24} weight="duotone" className="text-pink-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">Smart Analytics</h3>
          <p className="text-sm text-white/60">
            Get insights on giving patterns, campaign performance, and retention
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
          <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 mx-auto">
            <Sparkle size={24} weight="duotone" className="text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-2">AI-Powered</h3>
          <p className="text-sm text-white/60">
            Generate personalized thank-you messages and campaign content
          </p>
        </div>
      </div>

      {/* What to Expect */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-12 text-left">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">What to Expect</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Organization Setup</h3>
              <p className="text-white/60 text-sm">
                Tell us about your nonprofit - name, EIN, mission, and contact details
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Test Donation</h3>
              <p className="text-white/60 text-sm">
                Connect Stripe to process online donations (Pro/Enterprise only)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Invite Your Team</h3>
              <p className="text-white/60 text-sm">
                Add team members and assign roles (admin, fundraiser, or member)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">You're All Set!</h3>
              <p className="text-white/60 text-sm">
                Review your setup and start managing donors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onNext}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
        >
          Let's Get Started →
        </button>
      </div>

      <p className="text-white/40 text-sm mt-6">
        Takes about 5 minutes • You can skip optional steps
      </p>
    </div>
  );
}
