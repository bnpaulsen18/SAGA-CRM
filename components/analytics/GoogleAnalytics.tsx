'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initializeGA, trackPageView, removeGA, GA_MEASUREMENT_ID } from '@/lib/analytics/google-analytics';
import { useCookieConsent } from '@/lib/consent/use-cookie-consent';

/**
 * Google Analytics Component
 * Automatically initializes GA when user consents
 * Removes GA when user revokes consent
 * Tracks page views on route changes
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { canUseAnalytics, isLoading } = useCookieConsent();

  // Initialize or remove GA based on consent
  useEffect(() => {
    if (isLoading) return;

    if (canUseAnalytics && GA_MEASUREMENT_ID) {
      initializeGA();
    } else if (!canUseAnalytics) {
      removeGA();
    }
  }, [canUseAnalytics, isLoading]);

  // Track page views on route changes
  useEffect(() => {
    if (isLoading || !canUseAnalytics) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams, canUseAnalytics, isLoading]);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentUpdate = () => {
      // Consent changed - reinitialize or remove GA
      const currentConsent = canUseAnalytics;
      if (currentConsent) {
        initializeGA();
      } else {
        removeGA();
      }
    };

    window.addEventListener('consentUpdated', handleConsentUpdate);
    window.addEventListener('consentReset', () => removeGA());

    return () => {
      window.removeEventListener('consentUpdated', handleConsentUpdate);
      window.removeEventListener('consentReset', () => removeGA());
    };
  }, [canUseAnalytics]);

  // This component doesn't render anything
  return null;
}
