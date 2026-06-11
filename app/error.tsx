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

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to console for debugging; in production wire to your error tracker
    console.error('[AudioNest error boundary]', error)
  }, [error])

  const displayMessage =
    error.message && isUserReadable(error.message)
      ? error.message
      : 'An unexpected error occurred.'

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Brand-gradient exclamation icon */}
      <div
        className="flex items-center justify-center w-24 h-24 rounded-full text-5xl font-bold select-none"
        style={{
          background: 'linear-gradient(135deg, #FF8C00, #FFD700)',
          color: '#0F0A00',
          boxShadow: '0 0 48px rgba(255, 140, 0, 0.35)',
        }}
        aria-hidden="true"
      >
        !
      </div>

      {/* Heading */}
      <h1
        className="text-3xl font-bold"
        style={{
          background: 'linear-gradient(to right, #FF8C00, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Something went wrong
      </h1>

      {/* User-readable message */}
      <p className="text-gray-400 max-w-sm">{displayMessage}</p>

      {/* Digest for error reporting */}
      {error.digest && (
        <p className="text-xs text-gray-600 font-mono">
          Error ID: {error.digest}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg font-medium text-black cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #FF8C00, #FFD700)',
          }}
        >
          Try again
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-lg font-medium border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 transition-colors"
        >
          Back home
        </Link>
      </div>
    </div>
  )
}
