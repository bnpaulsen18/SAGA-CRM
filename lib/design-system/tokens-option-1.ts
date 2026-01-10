/**
 * OPTION 1: TRUST-FIRST MINIMALIST
 * Conservative enterprise design for nonprofit credibility
 */

export const option1Tokens = {
  name: 'Trust-First Minimalist',
  description: 'Conservative enterprise design emphasizing credibility and clarity',

  colors: {
    // Primary palette
    navy: '#0F1419',
    cloudWhite: '#F8F9FA',
    charcoal: '#2C3E50',

    // Accent colors (SAGA brand)
    purple: '#764ba2',
    orangeCoral: '#FF6B6B',

    // Semantic colors
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',

    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F8F9FA',
    bgDark: '#0F1419',

    // Text
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    textLight: '#BDC3C7',
    textWhite: '#FFFFFF',

    // Borders
    borderLight: '#E8EAED',
    borderMedium: '#BDC3C7',
  },

  typography: {
    fontFamily: {
      primary: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },

    // Sizes
    headline: {
      size: '3.5rem', // 56px
      lineHeight: '1.1',
      weight: 700,
      letterSpacing: '-0.02em',
    },

    subheadline: {
      size: '1.5rem', // 24px
      lineHeight: '1.4',
      weight: 400,
      letterSpacing: '0',
    },

    h2: {
      size: '2.5rem', // 40px
      lineHeight: '1.2',
      weight: 700,
      letterSpacing: '-0.01em',
    },

    h3: {
      size: '1.75rem', // 28px
      lineHeight: '1.3',
      weight: 600,
      letterSpacing: '0',
    },

    body: {
      size: '1.125rem', // 18px
      lineHeight: '1.6',
      weight: 400,
      letterSpacing: '0',
    },

    small: {
      size: '0.875rem', // 14px
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0',
    },
  },

  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    '2xl': '4rem',  // 64px
    '3xl': '6rem',  // 96px
  },

  layout: {
    maxWidth: '1200px',
    containerPadding: '2rem',
    sectionSpacing: '6rem',
  },

  effects: {
    shadow: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 4px 12px rgba(0, 0, 0, 0.1)',
      lg: '0 20px 40px rgba(0, 0, 0, 0.15)',
    },

    transition: {
      fast: '150ms ease',
      normal: '250ms ease',
      slow: '350ms ease',
    },

    borderRadius: {
      sm: '0.375rem',  // 6px
      md: '0.5rem',    // 8px
      lg: '0.75rem',   // 12px
      full: '9999px',
    },
  },

  components: {
    button: {
      primary: {
        background: 'linear-gradient(to right, #764ba2, #FF6B6B)',
        color: '#FFFFFF',
        padding: '0.875rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: '0.5rem',
        shadow: '0 4px 12px rgba(118, 75, 162, 0.3)',
      },

      secondary: {
        background: '#FFFFFF',
        color: '#764ba2',
        border: '2px solid #764ba2',
        padding: '0.875rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: '0.5rem',
      },

      ghost: {
        background: 'transparent',
        color: '#2C3E50',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: 500,
      },
    },

    card: {
      background: '#FFFFFF',
      border: '1px solid #E8EAED',
      borderRadius: '0.75rem',
      padding: '2rem',
      shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },

    input: {
      background: '#FFFFFF',
      border: '1px solid #BDC3C7',
      borderRadius: '0.5rem',
      padding: '0.875rem 1rem',
      fontSize: '1rem',
      focusBorder: '#764ba2',
    },
  },
} as const

export type Option1Tokens = typeof option1Tokens
