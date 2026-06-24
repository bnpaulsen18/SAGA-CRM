'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SagaCard from '@/components/ui/saga-card';

interface PublicDonationFormProps {
  organizationId: string;
  campaignId?: string;
  organizationName?: string;
}

const PRESET_AMOUNTS = [25, 50, 100, 250, 500];

export default function PublicDonationForm({
  organizationId,
  campaignId,
  organizationName,
}: PublicDonationFormProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAmount = customAmount ? parseFloat(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!selectedAmount || selectedAmount < 5) {
      setError('Minimum donation amount is $5');
      return;
    }

    if (!donorInfo.email || !donorInfo.firstName || !donorInfo.lastName) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          organizationId,
          campaignId,
          isRecurring,
          donorEmail: donorInfo.email,
          donorName: `${donorInfo.firstName} ${donorInfo.lastName}`,
          firstName: donorInfo.firstName,
          lastName: donorInfo.lastName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process donation');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }

  function handlePresetClick(presetAmount: number) {
    setAmount(presetAmount);
    setCustomAmount('');
  }

  function handleCustomAmountChange(value: string) {
    setCustomAmount(value);
    setAmount('');
  }

  return (
    <SagaCard className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            Make a Donation
          </h2>
          {organizationName && (
            <p className="text-white/70">
              Supporting {organizationName}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Donation Type Toggle */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsRecurring(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              !isRecurring
                ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            One-Time
          </button>
          <button
            type="button"
            onClick={() => setIsRecurring(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              isRecurring
                ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15'
            }`}
          >
            Monthly
            {isRecurring && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">
                Recurring
              </span>
            )}
          </button>
        </div>

        {/* Preset Amount Buttons */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-3">
            Select Amount
          </label>
          <div className="grid grid-cols-5 gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  amount === preset && !customAmount
                    ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div>
          <label className="block text-white/70 text-sm font-medium mb-2">
            Or Enter Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-lg font-semibold">
              $
            </span>
            <Input
              type="number"
              min="5"
              step="0.01"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="0.00"
              className="pl-8 text-lg font-semibold text-white"
            />
          </div>
          <p className="text-white/50 text-xs mt-1">Minimum: $5.00</p>
        </div>

        {/* Donor Information */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white">
            Your Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                First Name *
              </label>
              <Input
                type="text"
                required
                value={donorInfo.firstName}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, firstName: e.target.value })
                }
                placeholder="John"
                className="text-white"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Last Name *
              </label>
              <Input
                type="text"
                required
                value={donorInfo.lastName}
                onChange={(e) =>
                  setDonorInfo({ ...donorInfo, lastName: e.target.value })
                }
                placeholder="Doe"
                className="text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              required
              value={donorInfo.email}
              onChange={(e) =>
                setDonorInfo({ ...donorInfo, email: e.target.value })
              }
              placeholder="john.doe@example.com"
              className="text-white"
            />
            <p className="text-white/50 text-xs mt-1">
              We'll send your tax-deductible receipt to this email
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !selectedAmount || selectedAmount < 5}
          className="w-full py-6 text-lg font-bold"
          style={{ background: 'linear-gradient(to right, #764ba2, #ff6b35)' }}
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              {isRecurring ? 'Set Up Monthly Donation' : 'Donate'} ${selectedAmount || 0}
              {isRecurring && '/month'}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-white/50 text-xs">
            🔒 Secure payment processing by Stripe • Your donation is tax-deductible
          </p>
        </div>
      </form>
    </SagaCard>
  );
}
