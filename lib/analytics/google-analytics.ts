/**
 * Google Analytics 4 Integration
 * Only loads when user has given consent for analytics cookies
 */

import { hasAnalyticsConsent } from '../consent/cookie-consent';

// Get GA4 Measurement ID from environment
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Initialize Google Analytics
 * Call this only when user has given consent
 */
export function initializeGA(): void {
  if (!GA_MEASUREMENT_ID) {
    console.warn('[GA] Google Analytics ID not configured');
    return;
  }

  if (!hasAnalyticsConsent()) {
    console.log('[GA] Analytics blocked - user has not given consent');
    return;
  }

  // Check if GA is already loaded
  if (window.gtag) {
    console.log('[GA] Already initialized');
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true, // GDPR requirement
    cookie_flags: 'SameSite=None;Secure', // Modern cookie settings
  });

  console.log('[GA] Google Analytics initialized');
}

/**
 * Track page views
 * @param url - Page URL to track
 */
export function trackPageView(url: string): void {
  if (!hasAnalyticsConsent() || !window.gtag) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/**
 * Track custom events
 * @param action - Event action (e.g., 'donation_completed')
 * @param category - Event category (e.g., 'engagement')
 * @param label - Event label (optional)
 * @param value - Event value (optional)
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (!hasAnalyticsConsent() || !window.gtag) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * Track donation completed
 */
export function trackDonation(amount: number, method: string, campaignId?: string): void {
  trackEvent('donation_completed', 'donations', method, amount);

  if (campaignId) {
    trackEvent('campaign_donation', 'campaigns', campaignId, amount);
  }
}

/**
 * Track user signup
 */
export function trackSignup(method: string): void {
  trackEvent('sign_up', 'engagement', method);
}

/**
 * Track newsletter subscription
 */
export function trackNewsletterSignup(source: string): void {
  trackEvent('newsletter_signup', 'engagement', source);
}

/**
 * Remove Google Analytics when user revokes consent
 */
export function removeGA(): void {
  // Remove GA script
  const scripts = document.querySelectorAll(`script[src*="googletagmanager"]`);
  scripts.forEach((script) => script.remove());

  // Clear dataLayer
  if (window.dataLayer) {
    window.dataLayer = [];
  }

  // Remove gtag function
  delete window.gtag;

  // Clear GA cookies
  const gaCookies = document.cookie.split(';').filter((cookie) => {
    const name = cookie.split('=')[0].trim();
    return name.startsWith('_ga') || name.startsWith('_gid');
  });

  gaCookies.forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });

  console.log('[GA] Google Analytics removed');
}
