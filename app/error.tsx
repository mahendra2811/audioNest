'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

function isUserReadable(message: string): boolean {
  // Exclude stack traces and internal error strings
  if (!message) return false
  if (message.includes('    at ')) return false
  if (message.includes('\n    at ')) return false
  if (message.length > 200) return false
  return true
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to console for debugging; in production wire to your error tracker
    console.error('[AudioNest error boundary]', error)
  }, [error])

  const displayMessage =
    error.message && isUserReadable(error.message) ? error.message : 'An unexpected error occurred.'

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Brand-gradient exclamation icon */}
      <div
        className="flex items-center justify-center w-24 h-24 rounded-full text-5xl font-bold select-none"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: '#fff',
          boxShadow: '0 0 48px rgba(99,102,241,0.30)',
        }}
        aria-hidden="true"
      >
        !
      </div>

      {/* Heading */}
      <h1
        className="text-3xl font-bold"
        style={{
          background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Something went wrong
      </h1>

      {/* User-readable message */}
      <p className="text-muted max-w-sm">{displayMessage}</p>

      {/* Digest for error reporting */}
      {error.digest && <p className="text-xs text-muted font-mono">Error ID: {error.digest}</p>}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 rounded-lg font-medium text-white cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
          }}
        >
          Try again
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-lg font-medium border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 transition-colors"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
