'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeStep from '@/components/onboarding/WelcomeStep';
import OrganizationSetupStep from '@/components/onboarding/OrganizationSetupStep';
import TestDonationStep from '@/components/onboarding/TestDonationStep';
import InviteTeamStep from '@/components/onboarding/InviteTeamStep';
import CompleteStep from '@/components/onboarding/CompleteStep';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<any>(null);

  // Load current onboarding progress
  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await fetch('/api/onboarding/status');
        const data = await res.json();

        if (data.onboardingCompleted) {
          // Already completed, redirect to dashboard
          router.push('/dashboard');
          return;
        }

        setCurrentStep(data.onboardingStep || 1);
        setOrganizationData(data.organization);
      } catch (error) {
        console.error('Failed to load onboarding progress:', error);
        setCurrentStep(1);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [router]);

  const handleNext = async (stepData?: any) => {
    // Save progress to database
    try {
      await fetch('/api/onboarding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: currentStep + 1,
          data: stepData,
        }),
      });

      if (currentStep === 5) {
        // Mark onboarding as complete and redirect to dashboard
        await fetch('/api/onboarding/complete', {
          method: 'POST',
        });
        router.push('/dashboard');
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    // Skip current step and move to next
    await handleNext({ skipped: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="fixed top-8 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className="flex items-center"
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold transition-all duration-300
                    ${
                      step === currentStep
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white/40'
                    }
                  `}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 5 && (
                  <div
                    className={`
                      w-16 md:w-24 h-1 mx-2 transition-all duration-300
                      ${step < currentStep ? 'bg-green-500' : 'bg-white/10'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <WelcomeStep onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <OrganizationSetupStep
              onNext={handleNext}
              onBack={handleBack}
              initialData={organizationData}
            />
          )}
          {currentStep === 3 && (
            <TestDonationStep
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
              organizationData={organizationData}
            />
          )}
          {currentStep === 4 && (
            <InviteTeamStep
              onNext={handleNext}
              onBack={handleBack}
              onSkip={handleSkip}
            />
          )}
          {currentStep === 5 && (
            <CompleteStep
              onNext={handleNext}
              organizationData={organizationData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
