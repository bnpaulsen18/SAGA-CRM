'use client';

import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Warning, Rocket } from '@phosphor-icons/react';
import Link from 'next/link';

interface TestDonationStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  organizationData: any;
}

export default function TestDonationStep({
  onNext,
  onBack,
  onSkip,
  organizationData,
}: TestDonationStepProps) {
  const [stripeStatus, setStripeStatus] = useState<{
    connected: boolean;
    status: string;
    canConnect: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    try {
      const res = await fetch('/api/stripe/connect/status');
      const data = await res.json();
      setStripeStatus(data);
    } catch (error) {
      console.error('Failed to check Stripe status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    setConnecting(true);
    try {
      const res = await fetch('/api/stripe/connect/authorize', {
        method: 'POST',
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Redirect to Stripe OAuth
      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to start Stripe Connect:', error);
      alert('Failed to connect Stripe. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
      </div>
    );
  }

  // Free Tier - Can't connect Stripe
  if (!stripeStatus?.canConnect) {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/50">
            <CreditCard size={32} weight="duotone" className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Online Donation Processing</h2>
          <p className="text-white/60">
            Accept donations online with Stripe integration
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <Warning size={24} className="text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-2">Upgrade Required for Online Donations</h3>
              <p className="text-white/70 mb-4">
                Online donation processing with Stripe Connect is available on Pro and Enterprise plans.
                The Free plan includes manual donation tracking only.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all"
              >
                <Rocket size={20} />
                View Pricing Plans
              </Link>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 space-y-3">
            <h4 className="font-semibold text-white mb-3">What you'll get with Pro/Enterprise:</h4>
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Accept credit card donations online</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Automated donation receipts and thank-you emails</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Recurring donation support</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Only 2% platform fee + Stripe's standard rates</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/10"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // Pro/Enterprise - Stripe Connect Available
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/50">
          <CreditCard size={32} weight="duotone" className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Connect Stripe for Online Donations</h2>
        <p className="text-white/60">
          Set up payment processing to accept donations online
        </p>
      </div>

      {!stripeStatus?.connected ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Why Connect Stripe?</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Accept credit card donations securely</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Get paid directly to your bank account</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Automated receipts and donor communications</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
              <span>Support recurring donations</span>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <p className="text-blue-200 text-sm">
              <strong>Platform Fee:</strong> SAGA CRM charges 2% of each donation to maintain the platform.
              Stripe's standard processing fees also apply (~2.9% + $0.30 per transaction).
            </p>
          </div>

          <button
            onClick={handleConnectStripe}
            disabled={connecting}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40"
          >
            {connecting ? 'Connecting...' : 'Connect with Stripe →'}
          </button>

          <p className="text-white/40 text-sm text-center mt-4">
            You'll be redirected to Stripe to securely connect your account
          </p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <CheckCircle size={32} className="text-green-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-white">Stripe Connected Successfully!</h3>
              <p className="text-white/60">You're all set to accept online donations</p>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-200 text-sm">
              Your organization can now accept credit card donations online. Funds will be deposited
              directly to your connected bank account (minus the 2% platform fee and Stripe's fees).
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/10"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="px-6 py-3 text-white/60 hover:text-white transition-colors"
          >
            Skip for Now
          </button>
          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
