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
  onDelete
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

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.goal || parseFloat(formData.goal) <= 0) {
      newErrors.goal = 'Goal must be a positive number';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

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

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Campaign Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 bg-white/5 border ${
              errors.name ? 'border-red-500' : 'border-white/20'
            } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent`}
            placeholder="Annual Giving Campaign"
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className={`w-full px-4 py-3 bg-white/5 border ${
              errors.description ? 'border-red-500' : 'border-white/20'
            } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent resize-none`}
            placeholder="Describe your campaign goals and how funds will be used..."
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Goal Amount */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Goal Amount (USD) <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-white/60 text-lg">$</span>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className={`w-full pl-8 pr-4 py-3 bg-white/5 border ${
                errors.goal ? 'border-red-500' : 'border-white/20'
              } rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent`}
              placeholder="10000.00"
            />
          </div>
          {errors.goal && (
            <p className="text-red-400 text-sm mt-1">{errors.goal}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Start Date */}
          <div>
            <label className="block text-white font-medium mb-2">
              Start Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.startDate ? 'border-red-500' : 'border-white/20'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent`}
            />
            {errors.startDate && (
              <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-white font-medium mb-2">
              End Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.endDate ? 'border-red-500' : 'border-white/20'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent`}
            />
            {errors.endDate && (
              <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#764ba2] focus:border-transparent"
          >
            <option value="DRAFT" className="bg-[#1a1a2e]">Draft</option>
            <option value="ACTIVE" className="bg-[#1a1a2e]">Active</option>
            <option value="PAUSED" className="bg-[#1a1a2e]">Paused</option>
            <option value="COMPLETED" className="bg-[#1a1a2e]">Completed</option>
            <option value="CANCELLED" className="bg-[#1a1a2e]">Cancelled</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#764ba2] to-[#667eea] rounded-lg text-white font-medium hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : submitLabel}
          </button>
          <Link
            href="/campaigns"
            className="px-6 py-3 bg-white/5 border border-white/20 rounded-lg text-white font-medium hover:bg-white/10 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>

        {/* Delete Button (Edit Mode Only) */}
        {isEdit && onDelete && (
          <div className="mt-6 pt-6 border-t border-white/10">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm font-medium hover:bg-red-500/30 transition-colors"
              >
                Delete Campaign
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-white/70 text-sm">Are you sure? This action cannot be undone.</p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 rounded-lg text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors"
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
