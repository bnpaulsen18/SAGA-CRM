'use client';

import { useState } from 'react';
import { Cookie } from '@phosphor-icons/react';
import { resetConsent } from '@/lib/consent/cookie-consent';

/**
 * Button to reopen cookie preferences
 * Add this to your footer or privacy page
 */
export default function CookiePreferencesButton() {
  const [isResetting, setIsResetting] = useState(false);

  const handleClick = () => {
    setIsResetting(true);
    resetConsent();
    // Force page reload to show banner again
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isResetting}
      className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors disabled:opacity-50"
      aria-label="Manage cookie preferences"
    >
      <Cookie size={16} weight="bold" />
      <span>{isResetting ? 'Opening...' : 'Cookie Preferences'}</span>
    </button>
  );
}
