'use client';

import { CheckCircle, Rocket, CreditCard, Users, ChartLine } from '@phosphor-icons/react';

interface CompleteStepProps {
  onNext: () => void;
  organizationData: any;
}

export default function CompleteStep({ onNext, organizationData }: CompleteStepProps) {
  return (
    <div className="text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-6 shadow-lg shadow-green-500/50 animate-bounce">
          <CheckCircle size={56} weight="duotone" className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
          You're All Set!
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Welcome to SAGA CRM, <span className="text-white font-semibold">{organizationData?.name}</span>!
          Your nonprofit CRM is ready to go.
        </p>
      </div>

      {/* Setup Summary */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">What You've Accomplished</h2>
        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Organization Configured</h3>
              <p className="text-white/60 text-sm">
                Your nonprofit profile is complete with all necessary details
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CreditCard size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Payment Processing</h3>
              <p className="text-white/60 text-sm">
                {organizationData?.stripeConnectStatus === 'CONNECTED'
                  ? 'Stripe is connected and ready to accept donations'
                  : 'Set up anytime in Settings → Integrations'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Users size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Team Invitations</h3>
              <p className="text-white/60 text-sm">
                Your team members have been invited to collaborate
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <ChartLine size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Ready to Track</h3>
              <p className="text-white/60 text-sm">
                Start adding donors, tracking donations, and running campaigns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recommended Next Steps</h2>
        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm">
              1
            </span>
            <div>
              <h3 className="font-semibold text-white mb-1">Import Your Donor Data</h3>
              <p className="text-white/60 text-sm">
                Upload existing donor records from spreadsheets or other CRMs
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm">
              2
            </span>
            <div>
              <h3 className="font-semibold text-white mb-1">Create Your First Campaign</h3>
              <p className="text-white/60 text-sm">
                Set up a fundraising campaign and start engaging with donors
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm">
              3
            </span>
            <div>
              <h3 className="font-semibold text-white mb-1">Customize Your Donation Page</h3>
              <p className="text-white/60 text-sm">
                Brand your donation forms with your logo and colors
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-sm">
              4
            </span>
            <div>
              <h3 className="font-semibold text-white mb-1">Explore Analytics</h3>
              <p className="text-white/60 text-sm">
                Check out dashboards and reports to track your fundraising progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onNext}
        className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105"
      >
        <Rocket size={24} className="inline mr-2" weight="duotone" />
        Go to Dashboard
      </button>

      <p className="text-white/40 text-sm mt-6">
        Need help? Check out our documentation or contact support anytime
      </p>
    </div>
  );
}
