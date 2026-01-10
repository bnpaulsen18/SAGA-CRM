/**
 * OPTION 3: ENTERPRISE DATA-DRIVEN
 * Corporate professional design emphasizing metrics and efficiency
 */

export const option3Tokens = {
  name: 'Enterprise Data-Driven',
  description: 'Corporate professional design emphasizing data, metrics, and efficiency',

  colors: {
    // Primary palette (corporate, professional)
    navyPrimary: '#1E3A5F',
    steelGray: '#566573',
    iceBlue: '#D6EAF8',
    cloudWhite: '#FAFAFA',

    // Accent colors (SAGA brand integration)
    purple: '#764ba2',
    orange: '#FF6B35',

    // Data visualization colors
    chartBlue: '#3498DB',
    chartGreen: '#27AE60',
    chartOrange: '#E67E22',
    chartPurple: '#9B59B6',
    chartRed: '#E74C3C',

    // Backgrounds
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F4F6F8',
    bgDark: '#1E3A5F',
    bgLight: '#FAFAFA',
    bgChart: '#EBF5FB',

    // Text
    textPrimary: '#2C3E50',
    textSecondary: '#566573',
    textLight: '#95A5A6',
    textWhite: '#FFFFFF',
    textAccent: '#764ba2',

    // Borders
    borderLight: '#D5DBDB',
    borderMedium: '#ABB2B9',
    borderAccent: '#764ba2',
  },

  typography: {
    fontFamily: {
      primary: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },

    // Sizes (moderate, professional)
    headline: {
      size: '4rem', // 64px
      lineHeight: '1.1',
      weight: 700,
      letterSpacing: '-0.02em',
    },

    subheadline: {
      size: '1.75rem', // 28px
      lineHeight: '1.4',
      weight: 400,
      letterSpacing: '0',
    },

    h2: {
      size: '3rem', // 48px
      lineHeight: '1.2',
      weight: 700,
      letterSpacing: '-0.01em',
    },

    h3: {
      size: '1.875rem', // 30px
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

    caption: {
      size: '0.75rem', // 12px
      lineHeight: '1.4',
      weight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },

    metric: {
      size: '3rem', // 48px
      lineHeight: '1',
      weight: 700,
      letterSpacing: '-0.02em',
    },
  },

  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2.5rem',   // 40px
    xl: '3.5rem',   // 56px
    '2xl': '5rem',  // 80px
    '3xl': '7rem',  // 112px
  },

  layout: {
    maxWidth: '1280px',
    containerPadding: '2rem',
    sectionSpacing: '5rem',
    gridGap: '2rem',
  },

  effects: {
    shadow: {
      sm: '0 1px 3px rgba(30, 58, 95, 0.08)',
      md: '0 4px 12px rgba(30, 58, 95, 0.12)',
      lg: '0 12px 32px rgba(30, 58, 95, 0.16)',
      inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    },

    gradient: {
      primary: 'linear-gradient(to right, #764ba2, #FF6B35)',
      subtle: 'linear-gradient(to bottom, #FFFFFF, #F4F6F8)',
      chart: 'linear-gradient(to top, rgba(52, 152, 219, 0.1), transparent)',
    },

    transition: {
      fast: '150ms ease-in-out',
      normal: '250ms ease-in-out',
      slow: '400ms ease-in-out',
    },

    borderRadius: {
      sm: '0.25rem',  // 4px
      md: '0.5rem',   // 8px
      lg: '0.75rem',  // 12px
      full: '9999px',
    },
  },

  components: {
    button: {
      primary: {
        background: 'linear-gradient(to right, #764ba2, #FF6B35)',
        color: '#FFFFFF',
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: '0.5rem',
        shadow: '0 4px 12px rgba(118, 75, 162, 0.25)',
      },

      secondary: {
        background: '#FFFFFF',
        color: '#1E3A5F',
        border: '2px solid #1E3A5F',
        padding: '1rem 2rem',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: '0.5rem',
      },

      ghost: {
        background: 'transparent',
        color: '#566573',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: 500,
      },
    },

    card: {
      background: '#FFFFFF',
      border: '1px solid #D5DBDB',
      borderRadius: '0.75rem',
      padding: '2rem',
      shadow: '0 4px 12px rgba(30, 58, 95, 0.12)',
    },

    input: {
      background: '#FFFFFF',
      border: '1px solid #ABB2B9',
      borderRadius: '0.5rem',
      padding: '0.875rem 1rem',
      fontSize: '1rem',
      focusBorder: '#764ba2',
      focusShadow: '0 0 0 3px rgba(118, 75, 162, 0.1)',
    },

    metric: {
      background: 'linear-gradient(to bottom, #FFFFFF, #F4F6F8)',
      border: '1px solid #D5DBDB',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      shadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    },

    tab: {
      background: '#F4F6F8',
      activeBackground: '#FFFFFF',
      border: '1px solid #D5DBDB',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
    },

    badge: {
      background: '#EBF5FB',
      color: '#1E3A5F',
      border: '1px solid #D6EAF8',
      borderRadius: '0.25rem',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
  },
} as const

export type Option3Tokens = typeof option3Tokens
