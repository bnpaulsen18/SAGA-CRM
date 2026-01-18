'use client'

/**
 * Global Error Boundary
 *
 * This catches errors at the root level, including errors in the root layout.
 * This is the fallback when app/error.tsx can't catch it.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          margin: '0 16px',
          padding: '32px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          {/* Error Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="#f87171"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Application Error
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '24px',
            lineHeight: 1.5
          }}>
            A critical error occurred. This may be due to a configuration issue or database connection problem.
          </p>

          {error.digest && (
            <p style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '12px',
              marginBottom: '24px',
              fontFamily: 'monospace'
            }}>
              Error ID: {error.digest}
            </p>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Try Again
            </button>

            <a
              href="/login"
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Go to Login
            </a>

            <a
              href="/"
              style={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Go to Homepage
            </a>
          </div>

          <p style={{
            marginTop: '24px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '12px'
          }}>
            If this problem persists, please contact support or check your environment configuration.
          </p>
        </div>
      </body>
    </html>
  )
}
