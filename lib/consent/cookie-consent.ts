/**
 * Cookie Consent Management
 * GDPR/CCPA Compliant Cookie Consent System
 */

export type ConsentPreferences = {
  necessary: boolean; // Always true, required for site functionality
  analytics: boolean; // Google Analytics, tracking
  marketing: boolean; // Marketing cookies (future)
};

export type ConsentStatus = 'pending' | 'accepted' | 'rejected' | 'partial';

const CONSENT_COOKIE_NAME = 'saga_cookie_consent';
const CONSENT_VERSION = '1.0'; // Increment when privacy policy changes

export interface ConsentData {
  version: string;
  timestamp: number;
  preferences: ConsentPreferences;
  status: ConsentStatus;
}

/**
 * Get current consent preferences from localStorage
 */
export function getConsentPreferences(): ConsentData | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME);
    if (!stored) return null;

    const data: ConsentData = JSON.parse(stored);

    // Check if consent version matches (re-request if privacy policy updated)
    if (data.version !== CONSENT_VERSION) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading consent preferences:', error);
    return null;
  }
}

/**
 * Save consent preferences to localStorage
 */
export function saveConsentPreferences(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return;

  const status: ConsentStatus = preferences.analytics || preferences.marketing
    ? preferences.analytics && preferences.marketing
      ? 'accepted'
      : 'partial'
    : 'rejected';

  const data: ConsentData = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    preferences,
    status,
  };

  try {
    localStorage.setItem(CONSENT_COOKIE_NAME, JSON.stringify(data));

    // Trigger custom event for analytics integration
    window.dispatchEvent(
      new CustomEvent('consentUpdated', { detail: data })
    );
  } catch (error) {
    console.error('Error saving consent preferences:', error);
  }
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): void {
  saveConsentPreferences({
    necessary: true,
    analytics: true,
    marketing: true,
  });
}

/**
 * Reject optional cookies (keep only necessary)
 */
export function rejectOptionalCookies(): void {
  saveConsentPreferences({
    necessary: true,
    analytics: false,
    marketing: false,
  });
}

/**
 * Check if user has given consent for analytics
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getConsentPreferences();
  return consent?.preferences.analytics ?? false;
}

/**
 * Check if user has given consent for marketing
 */
export function hasMarketingConsent(): boolean {
  const consent = getConsentPreferences();
  return consent?.preferences.marketing ?? false;
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowConsentBanner(): boolean {
  return getConsentPreferences() === null;
}

/**
 * Reset consent (for testing or privacy policy updates)
 */
export function resetConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONSENT_COOKIE_NAME);
  window.dispatchEvent(new CustomEvent('consentReset'));
}
