'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { ArrowLeft } from '@phosphor-icons/react';

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          goal: parseFloat(data.goal),
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          status: data.status,
        }),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      const campaign = await response.json();
      router.push(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/campaigns" className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4 transition-colors text-sm">
            <ArrowLeft size={16} weight="bold" /> Back to Campaigns
          </Link>
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>Create New Campaign</h1>
          <p className="text-[var(--ink-soft)]">Set up a new fundraising campaign</p>
        </div>

        <CampaignForm onSubmit={handleSubmit} submitLabel="Create Campaign" />
      </div>
    </>
  );
}
