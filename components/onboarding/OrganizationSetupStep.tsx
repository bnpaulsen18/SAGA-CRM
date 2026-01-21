'use client';

import { useState } from 'react';
import { Building, EnvelopeSimple, Phone, Globe, IdentificationCard, GraduationCap } from '@phosphor-icons/react';

interface OrganizationSetupStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export default function OrganizationSetupStep({
  onNext,
  onBack,
  initialData,
}: OrganizationSetupStepProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    ein: initialData?.ein || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    website: initialData?.website || '',
    missionStatement: initialData?.missionStatement || '',
    primaryProgram: initialData?.primaryProgram || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!formData.ein.trim()) {
      newErrors.ein = 'EIN is required';
    } else if (!/^\d{2}-?\d{7}$/.test(formData.ein)) {
      newErrors.ein = 'EIN must be in format XX-XXXXXXX or XXXXXXXXX';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save organization details
      const res = await fetch('/api/organization/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to save organization details');
      }

      onNext(formData);
    } catch (error: any) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/50">
          <Building size={32} weight="duotone" className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Tell Us About Your Organization</h2>
        <p className="text-white/60">
          We'll use this information to personalize your CRM and donation pages
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div className="space-y-6">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Organization Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Building size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="My Awesome Nonprofit"
              />
            </div>
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* EIN */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              EIN (Employer Identification Number) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <IdentificationCard size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={formData.ein}
                onChange={(e) => handleChange('ein', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="XX-XXXXXXX"
              />
            </div>
            {errors.ein && <p className="text-red-400 text-sm mt-1">{errors.ein}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Organization Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <EnvelopeSimple size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="info@mynonprofit.org"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Website (Optional)
            </label>
            <div className="relative">
              <Globe size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://mynonprofit.org"
              />
            </div>
            {errors.website && <p className="text-red-400 text-sm mt-1">{errors.website}</p>}
          </div>

          {/* Mission Statement */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Mission Statement (Optional)
            </label>
            <div className="relative">
              <GraduationCap size={20} className="absolute left-3 top-3 text-white/40" />
              <textarea
                value={formData.missionStatement}
                onChange={(e) => handleChange('missionStatement', e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="Our mission is to..."
              />
            </div>
          </div>

          {/* Primary Program */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Primary Program Area (Optional)
            </label>
            <input
              type="text"
              value={formData.primaryProgram}
              onChange={(e) => handleChange('primaryProgram', e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Education, Healthcare, Environment, etc."
            />
          </div>

          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors border border-white/10"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/40"
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </div>
      </form>
    </div>
  );
}
