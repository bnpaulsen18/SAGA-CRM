'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CampaignForm from '@/components/campaigns/CampaignForm';
import { ArrowLeft } from '@phosphor-icons/react';

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const response = await fetch(`/api/campaigns/${id}`);
        if (!response.ok) throw new Error('Failed to fetch campaign');
        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        alert('Failed to load campaign');
        router.push('/campaigns');
      } finally {
        setLoading(false);
      }
    }
    fetchCampaign();
  }, [id, router]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'PUT',
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
      if (!response.ok) throw new Error('Failed to update campaign');
      router.push(`/campaigns/${id}`);
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete campaign');
      router.push('/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center py-20 text-[var(--ink-soft)]">Loading…</div>
      </>
    );
  }

  if (!campaign) return null;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href={`/campaigns/${id}`} className="inline-flex items-center gap-1 text-[var(--ink-soft)] hover:text-[var(--ink)] mb-4 transition-colors text-sm">
            <ArrowLeft size={16} weight="bold" /> Back to Campaign
          </Link>
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-bricolage), sans-serif' }}>Edit Campaign</h1>
          <p className="text-[var(--ink-soft)]">Update campaign details</p>
        </div>

        <CampaignForm
          initialData={{
            name: campaign.name,
            description: campaign.description,
            goal: campaign.goal?.toString() || '',
            startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
            endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
            status: campaign.status,
          }}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          submitLabel="Update Campaign"
          isEdit={true}
        />
      </div>
    </>
  );
}
