'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield, Gear } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  shouldShowConsentBanner,
  acceptAllCookies,
  rejectOptionalCookies,
  saveConsentPreferences,
  type ConsentPreferences,
} from '@/lib/consent/cookie-consent';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if we should show the banner (after component mounts)
    setShowBanner(shouldShowConsentBanner());
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setShowBanner(false);
  };

  const handleRejectOptional = () => {
    rejectOptionalCookies();
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    saveConsentPreferences(preferences);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        aria-hidden="true"
      />

      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-in slide-in-from-bottom duration-500"
        role="dialog"
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
      >
        <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Main Banner Content */}
          {!showDetails ? (
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center">
                    <Cookie size={24} weight="bold" className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    id="cookie-consent-title"
                    className="text-xl font-bold text-white mb-2"
                  >
                    We Value Your Privacy
                  </h3>
                  <p
                    id="cookie-consent-description"
                    className="text-white/80 text-sm md:text-base leading-relaxed mb-4"
                  >
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                    By clicking "Accept All", you consent to our use of cookies.{' '}
                    <button
                      onClick={() => setShowDetails(true)}
                      className="text-purple-300 hover:text-purple-200 underline font-medium"
                      aria-label="View cookie preferences"
                    >
                      Customize preferences
                    </button>
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleAcceptAll}
                      className="text-white font-semibold"
                      style={{
                        background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                      }}
                    >
                      <Shield size={18} weight="bold" className="mr-2" />
                      Accept All Cookies
                    </Button>

                    <Button
                      onClick={handleRejectOptional}
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      Reject Optional
                    </Button>

                    <Button
                      onClick={() => setShowDetails(true)}
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                    >
                      <Gear size={18} weight="bold" className="mr-2" />
                      Preferences
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Detailed Preferences View */
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Cookie Preferences
                  </h3>
                  <p className="text-white/70 text-sm">
                    Choose which cookies you want to allow
                  </p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white/60 hover:text-white transition-colors"
                  aria-label="Close preferences"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        Necessary Cookies
                      </h4>
                      <p className="text-white/70 text-sm">
                        Essential for the website to function properly. These cannot be disabled.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        Analytics Cookies
                      </h4>
                      <p className="text-white/70 text-sm">
                        Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          analytics: !prev.analytics,
                        }))
                      }
                      className={`ml-4 w-12 h-6 rounded-full flex items-center transition-all ${
                        preferences.analytics
                          ? 'bg-gradient-to-r from-purple-500 to-orange-500 justify-end'
                          : 'bg-white/20 justify-start'
                      } px-1`}
                      aria-label={`${preferences.analytics ? 'Disable' : 'Enable'} analytics cookies`}
                      role="switch"
                      aria-checked={preferences.analytics}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        Marketing Cookies
                      </h4>
                      <p className="text-white/70 text-sm">
                        Used to track visitors across websites to display relevant ads and marketing campaigns.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          marketing: !prev.marketing,
                        }))
                      }
                      className={`ml-4 w-12 h-6 rounded-full flex items-center transition-all ${
                        preferences.marketing
                          ? 'bg-gradient-to-r from-purple-500 to-orange-500 justify-end'
                          : 'bg-white/20 justify-start'
                      } px-1`}
                      aria-label={`${preferences.marketing ? 'Disable' : 'Enable'} marketing cookies`}
                      role="switch"
                      aria-checked={preferences.marketing}
                    >
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSavePreferences}
                  className="text-white font-semibold flex-1"
                  style={{
                    background: 'linear-gradient(to right, #764ba2, #ff6b35)',
                  }}
                >
                  Save Preferences
                </Button>

                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10 flex-1"
                >
                  Accept All
                </Button>
              </div>

              <p className="text-white/50 text-xs text-center mt-4">
                You can change your preferences at any time in the footer.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
