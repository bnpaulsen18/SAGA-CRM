/**
 * OPTION 2: EMOTIONAL IMPACT
 * Mission-driven bold design for nonprofit storytelling
 */

export const option2Tokens = {
  name: 'Emotional Impact',
  description: 'Bold, mission-driven design emphasizing impact and transformation',

  colors: {
    // Primary palette (rich, warm)
    aubergine: '#4A1942',
    coral: '#FF6B35',
    warmPink: '#E63946',
    deepNavy: '#1D3557',

    // Accent colors
    teal: '#06A77D',
    gold: '#F4A261',
    lightCream: '#FFF5EB',

    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgGradientStart: '#4A1942',
    bgGradientEnd: '#FF6B35',
    bgDark: '#1D3557',
    bgLight: '#FFF5EB',

    // Text
    textPrimary: '#1D3557',
    textSecondary: '#6C757D',
    textLight: '#ADB5BD',
    textWhite: '#FFFFFF',
    textAccent: '#FF6B35',

    // Borders
    borderLight: '#DEE2E6',
    borderAccent: '#FF6B35',
  },

  typography: {
    fontFamily: {
      primary: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },

    // Sizes (larger, bolder)
    headline: {
      size: '5rem', // 80px
      lineHeight: '1',
      weight: 800,
      letterSpacing: '-0.03em',
    },

    subheadline: {
      size: '2rem', // 32px
      lineHeight: '1.3',
      weight: 400,
      letterSpacing: '0',
    },

    h2: {
      size: '3.5rem', // 56px
      lineHeight: '1.1',
      weight: 700,
      letterSpacing: '-0.02em',
    },

    h3: {
      size: '2rem', // 32px
      lineHeight: '1.2',
      weight: 600,
      letterSpacing: '-0.01em',
    },

    body: {
      size: '1.25rem', // 20px
      lineHeight: '1.7',
      weight: 400,
      letterSpacing: '0',
    },

    small: {
      size: '1rem', // 16px
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0',
    },

    caption: {
      size: '0.75rem', // 12px
      lineHeight: '1.4',
      weight: 500,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },

  spacing: {
    xs: '0.75rem',  // 12px
    sm: '1.5rem',   // 24px
    md: '2rem',     // 32px
    lg: '3rem',     // 48px
    xl: '4rem',     // 64px
    '2xl': '6rem',  // 96px
    '3xl': '8rem',  // 128px
  },

  layout: {
    maxWidth: '1400px',
    containerPadding: '2.5rem',
    sectionSpacing: '8rem',
  },

  effects: {
    shadow: {
      sm: '0 2px 8px rgba(74, 25, 66, 0.1)',
      md: '0 8px 24px rgba(74, 25, 66, 0.15)',
      lg: '0 24px 48px rgba(74, 25, 66, 0.25)',
      glow: '0 0 40px rgba(255, 107, 53, 0.3)',
    },

    gradient: {
      primary: 'linear-gradient(135deg, #4A1942 0%, #E63946 50%, #FF6B35 100%)',
      overlay: 'linear-gradient(to bottom, rgba(74, 25, 66, 0.8), rgba(255, 107, 53, 0.8))',
      subtle: 'linear-gradient(to right, rgba(74, 25, 66, 0.05), rgba(255, 107, 53, 0.05))',
    },

    transition: {
      fast: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    borderRadius: {
      sm: '0.5rem',   // 8px
      md: '1rem',     // 16px
      lg: '1.5rem',   // 24px
      full: '9999px',
    },
  },

  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #4A1942 0%, #E63946 50%, #FF6B35 100%)',
        color: '#FFFFFF',
        padding: '1.25rem 2.5rem',
        fontSize: '1.125rem',
        fontWeight: 700,
        borderRadius: '0.75rem',
        shadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
      },

      secondary: {
        background: 'rgba(255, 107, 53, 0.1)',
        color: '#FF6B35',
        border: '2px solid #FF6B35',
        padding: '1.25rem 2.5rem',
        fontSize: '1.125rem',
        fontWeight: 700,
        borderRadius: '0.75rem',
      },

      ghost: {
        background: 'transparent',
        color: '#1D3557',
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        fontWeight: 600,
      },
    },

    card: {
      background: '#FFFFFF',
      border: 'none',
      borderRadius: '1.5rem',
      padding: '2.5rem',
      shadow: '0 8px 24px rgba(74, 25, 66, 0.15)',
    },

    input: {
      background: '#FFFFFF',
      border: '2px solid #DEE2E6',
      borderRadius: '0.75rem',
      padding: '1rem 1.25rem',
      fontSize: '1.125rem',
      focusBorder: '#FF6B35',
      focusShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)',
    },

    testimonial: {
      background: 'linear-gradient(to bottom right, rgba(74, 25, 66, 0.05), rgba(255, 107, 53, 0.05))',
      border: '1px solid rgba(255, 107, 53, 0.2)',
      borderRadius: '1.5rem',
      padding: '2rem',
    },
  },
} as const

export type Option2Tokens = typeof option2Tokens
