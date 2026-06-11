'use client'

import { Geist } from 'next/font/google'
import { useEffect } from 'react'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[AudioNest global error boundary]', error)
  }, [error])

  return (
    <html lang="en">
      <body
        className={geist.variable}
        style={{
          fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
          background: '#0F0A00',
          color: '#FFF8ED',
          margin: 0,
          padding: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '480px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '5rem',
              height: '5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF8C00, #FFD700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#0F0A00',
              boxShadow: '0 0 48px rgba(255, 140, 0, 0.35)',
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            !
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(to right, #FF8C00, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Something went wrong
          </h1>

          {/* Message */}
          <p style={{ color: '#B8A77F', margin: 0, lineHeight: 1.6 }}>
            A critical error occurred. Please try again or refresh the page.
          </p>

          {/* Digest */}
          {error.digest && (
            <p
              style={{
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                color: '#7A6A50',
                margin: 0,
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          {/* Retry button */}
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(to right, #FF8C00, #FFD700)',
              color: '#0F0A00',
              marginTop: '0.5rem',
            }}
          >
            Retry
          </button>
        </div>
      </body>
    </html>
  )
}
