'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CampaignForm from '@/components/campaigns/CampaignForm';

export default function EditCampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const response = await fetch(`/api/campaigns/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign');
        }
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
  }, [params.id, router]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'PUT',
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
        throw new Error('Failed to update campaign');
      }

      router.push(`/campaigns/${params.id}`);
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      router.push('/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/campaigns/${params.id}`}
            className="inline-flex items-center text-white/60 hover:text-white mb-4 transition-colors"
          >
            ← Back to Campaign
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Edit Campaign</h1>
          <p className="text-white/60">Update campaign details</p>
        </div>

        {/* Form */}
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
    </div>
  );
}
