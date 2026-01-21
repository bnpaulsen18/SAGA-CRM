'use client';

import { useState } from 'react';
import { UserPlus, EnvelopeSimple, Trash, Users } from '@phosphor-icons/react';

interface TeamMember {
  email: string;
  role: 'ADMIN' | 'FUNDRAISER' | 'MEMBER';
}

interface InviteTeamStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export default function InviteTeamStep({
  onNext,
  onBack,
  onSkip,
}: InviteTeamStepProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'FUNDRAISER' | 'MEMBER'>('MEMBER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddMember = () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      setError('This email has already been added');
      return;
    }

    setMembers([...members, { email: email.trim(), role }]);
    setEmail('');
    setError('');
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSendInvites = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to send invites');
      }

      onNext();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-300';
      case 'FUNDRAISER':
        return 'bg-pink-500/20 text-pink-300';
      case 'MEMBER':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-white/10 text-white/60';
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-lg shadow-purple-500/50">
          <Users size={32} weight="duotone" className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Invite Your Team</h2>
        <p className="text-white/60">
          Collaborate with your team to manage donors and campaigns
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-6">
        {/* Add Team Member Form */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-3">
            Add Team Members
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <EnvelopeSimple size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="colleague@email.com"
                />
              </div>
            </div>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
            >
              <option value="MEMBER">Member</option>
              <option value="FUNDRAISER">Fundraiser</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button
              onClick={handleAddMember}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all whitespace-nowrap"
            >
              <UserPlus size={20} className="inline mr-2" />
              Add
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Role Descriptions */}
        <div className="bg-white/5 rounded-lg p-4 mb-6 space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor('ADMIN')}`}>
              ADMIN
            </span>
            <span className="text-white/60">Full access - manage settings, team, and all features</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor('FUNDRAISER')}`}>
              FUNDRAISER
            </span>
            <span className="text-white/60">Manage donors, donations, campaigns, and communications</span>
          </div>
          <div className="flex items-start gap-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor('MEMBER')}`}>
              MEMBER
            </span>
            <span className="text-white/60">View-only access to donors and reports</span>
          </div>
        </div>

        {/* Added Members List */}
        {members.length > 0 ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white mb-2">
              Team Members to Invite ({members.length})
            </label>
            {members.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <EnvelopeSimple size={20} className="text-white/40" />
                  <span className="text-white">{member.email}</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleBadgeColor(member.role)}`}>
                    {member.role}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveMember(index)}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/40">
            <Users size={48} className="mx-auto mb-2 opacity-20" />
            <p>No team members added yet</p>
          </div>
        )}
      </div>

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
            onClick={members.length > 0 ? handleSendInvites : onNext}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all"
          >
            {loading ? 'Sending Invites...' : members.length > 0 ? 'Send Invites →' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
