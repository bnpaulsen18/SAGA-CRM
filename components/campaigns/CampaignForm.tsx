'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CampaignFormData {
  name: string;
  description: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface CampaignFormProps {
  initialData?: Partial<CampaignFormData>;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
  onDelete?: () => Promise<void>;
}

export default function CampaignForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Campaign',
  isEdit = false,
  onDelete,
}: CampaignFormProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    goal: initialData?.goal || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    status: initialData?.status || 'DRAFT',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Campaign name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.goal || parseFloat(formData.goal) <= 0) newErrors.goal = 'Goal must be a positive number';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const field = (hasError: boolean) =>
    `w-full px-4 py-3 bg-[var(--paper)] border ${hasError ? 'border-[#C0573F]' : 'border-[var(--line)]'} rounded-lg text-[var(--ink)] placeholder-[var(--ink-faint)] focus:outline-none focus:ring-2 focus:ring-[#5B4B8A] focus:border-transparent`;

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-8">
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block text-[var(--ink)] font-medium mb-2">
            Campaign Name <span className="text-[#C0573F]">*</span>
          </label>
          <input
            type="text" required value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={field(!!errors.name)}
            placeholder="Annual Giving Campaign"
          />
          {errors.name && <p className="text-[#C0573F] text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-[var(--ink)] font-medium mb-2">
            Description <span className="text-[#C0573F]">*</span>
          </label>
          <textarea
            required value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className={`${field(!!errors.description)} resize-none`}
            placeholder="Describe your campaign goals and how funds will be used..."
          />
          {errors.description && <p className="text-[#C0573F] text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Goal Amount */}
        <div className="mb-6">
          <label className="block text-[var(--ink)] font-medium mb-2">
            Goal Amount (USD) <span className="text-[#C0573F]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-[var(--ink-faint)] text-lg">$</span>
            <input
              type="number" required min="0.01" step="0.01" value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className={`${field(!!errors.goal)} pl-8`}
              placeholder="10000.00"
            />
          </div>
          {errors.goal && <p className="text-[#C0573F] text-sm mt-1">{errors.goal}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[var(--ink)] font-medium mb-2">
              Start Date <span className="text-[#C0573F]">*</span>
            </label>
            <input
              type="date" required value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={field(!!errors.startDate)}
            />
            {errors.startDate && <p className="text-[#C0573F] text-sm mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-[var(--ink)] font-medium mb-2">
              End Date <span className="text-[#C0573F]">*</span>
            </label>
            <input
              type="date" required value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={field(!!errors.endDate)}
            />
            {errors.endDate && <p className="text-[#C0573F] text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-[var(--ink)] font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--paper)] border border-[var(--line)] rounded-lg text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[#5B4B8A] focus:border-transparent"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit" disabled={loading}
            className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#F97A5E,#E0507A 60%,#5B4B8A)' }}
          >
            {loading ? 'Saving...' : submitLabel}
          </button>
          <Link
            href="/campaigns"
            className="px-6 py-3 bg-[var(--surface)] border border-[var(--line)] rounded-lg text-[var(--ink)] font-medium hover:bg-[var(--surface-2)] transition-colors text-center"
          >
            Cancel
          </Link>
        </div>

        {/* Delete Button (Edit Mode Only) */}
        {isEdit && onDelete && (
          <div className="mt-6 pt-6 border-t border-[var(--line)]">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-[#F6EBE6] border border-[#EAD3C8] rounded-lg text-[#C0573F] text-sm font-medium hover:bg-[#F0DDD3] transition-colors"
              >
                Delete Campaign
              </button>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-[var(--ink-soft)] text-sm">Are you sure? This action cannot be undone.</p>
                <button
                  type="button" onClick={handleDelete} disabled={loading}
                  className="px-4 py-2 bg-[#C0573F] rounded-lg text-white text-sm font-medium hover:bg-[#A8492F] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button
                  type="button" onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-lg text-[var(--ink)] text-sm font-medium hover:bg-[var(--surface-2)] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
