'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CampaignForm from '@/components/campaigns/CampaignForm';

export default function NewCampaignPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          goal: parseFloat(data.goal),
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          status: data.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const campaign = await response.json();
      router.push(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/campaigns"
            className="inline-flex items-center text-white/60 hover:text-white mb-4 transition-colors"
          >
            ← Back to Campaigns
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Campaign</h1>
          <p className="text-white/60">Set up a new fundraising campaign</p>
        </div>

        {/* Form */}
        <CampaignForm onSubmit={handleSubmit} submitLabel="Create Campaign" />
      </div>
    </div>
  );
}
