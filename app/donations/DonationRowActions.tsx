'use client';

import { useState } from 'react';

interface DonationRowActionsProps {
  donationId: string;
}

export default function DonationRowActions({ donationId }: DonationRowActionsProps) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResendReceipt = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event

    setSending(true);
    setMessage('');

    try {
      const response = await fetch(`/api/donations/${donationId}/resend-receipt`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Receipt sent!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to send');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error resending receipt:', error);
      setMessage('Error occurred');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSending(false);
    }
  };

  const handleDownloadPDF = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    window.open(`/api/donations/${donationId}/receipt`, '_blank');
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={handleResendReceipt}
        disabled={sending}
        className="px-3 py-1 bg-[#764ba2]/20 border border-[#764ba2]/30 rounded-lg text-[#764ba2] hover:bg-[#764ba2]/30 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        title="Resend email receipt"
      >
        {sending ? 'Sending...' : '📧 Resend'}
      </button>
      <button
        onClick={handleDownloadPDF}
        className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors text-xs font-medium"
        title="Download PDF receipt"
      >
        📄 PDF
      </button>
      {message && (
        <span className={`text-xs ${message.includes('sent') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </span>
      )}
    </div>
  );
}
