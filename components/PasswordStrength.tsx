'use client';

import { useMemo } from 'react';
import { Check, X } from '@phosphor-icons/react';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export interface PasswordValidation {
  isValid: boolean;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number; // 0-4
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

export function validatePassword(password: string): PasswordValidation {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Calculate strength score (0-4)
  let score = 0;
  if (requirements.minLength) score++;
  if (requirements.hasUpperCase && requirements.hasLowerCase) score++;
  if (requirements.hasNumber) score++;
  if (requirements.hasSpecialChar) score++;

  // Determine strength level
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
  if (score === 4) strength = 'strong';
  else if (score === 3) strength = 'good';
  else if (score === 2) strength = 'fair';

  // Password is valid if it meets minimum requirements
  const isValid = requirements.minLength && score >= 2;

  return {
    isValid,
    strength,
    score,
    requirements,
  };
}

export default function PasswordStrength({
  password,
  showRequirements = true,
}: PasswordStrengthProps) {
  const validation = useMemo(() => validatePassword(password), [password]);

  if (!password) {
    return null;
  }

  const getStrengthColor = () => {
    switch (validation.strength) {
      case 'strong':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-red-500';
    }
  };

  const getStrengthText = () => {
    switch (validation.strength) {
      case 'strong':
        return 'Strong password';
      case 'good':
        return 'Good password';
      case 'fair':
        return 'Fair password';
      case 'weak':
        return 'Weak password';
    }
  };

  const getStrengthTextColor = () => {
    switch (validation.strength) {
      case 'strong':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'weak':
        return 'text-red-600';
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(validation.score / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <div className="space-y-1 text-sm">
          <RequirementItem
            met={validation.requirements.minLength}
            text="At least 8 characters"
          />
          <RequirementItem
            met={validation.requirements.hasUpperCase && validation.requirements.hasLowerCase}
            text="Upper and lowercase letters"
          />
          <RequirementItem
            met={validation.requirements.hasNumber}
            text="At least one number"
          />
          <RequirementItem
            met={validation.requirements.hasSpecialChar}
            text="At least one special character (!@#$%^&*)"
          />
        </div>
      )}
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check size={16} weight="bold" className="text-green-600" />
      ) : (
        <X size={16} weight="bold" className="text-gray-400" />
      )}
      <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  );
}
