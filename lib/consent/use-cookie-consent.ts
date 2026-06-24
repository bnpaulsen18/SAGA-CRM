'use client';

import { useState, useEffect } from 'react';
import {
  getConsentPreferences,
  hasAnalyticsConsent,
  hasMarketingConsent,
  type ConsentData,
} from './cookie-consent';

/**
 * React hook to access cookie consent preferences
 * Automatically updates when consent changes
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial load
    setConsent(getConsentPreferences());
    setIsLoading(false);

    // Listen for consent updates
    const handleConsentUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentData>;
      setConsent(customEvent.detail);
    };

    const handleConsentReset = () => {
      setConsent(null);
    };

    window.addEventListener('consentUpdated', handleConsentUpdate);
    window.addEventListener('consentReset', handleConsentReset);

    return () => {
      window.removeEventListener('consentUpdated', handleConsentUpdate);
      window.removeEventListener('consentReset', handleConsentReset);
    };
  }, []);

  return {
    consent,
    isLoading,
    hasConsent: consent !== null,
    canUseAnalytics: hasAnalyticsConsent(),
    canUseMarketing: hasMarketingConsent(),
  };
}
