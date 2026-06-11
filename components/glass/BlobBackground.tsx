'use client'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useProcessingState } from '@/lib/store/processing'

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

/**
 * Calm indigo/violet glow behind the frosted UI. Transparent canvas, so the
 * page background (which flips with the theme) shows through in both modes.
 * No per-pixel grain, no refraction — freezes under reduced-motion + processing.
 */
export function BlobBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const blobsRef = useRef<Blob[]>([])
  const prefersReducedMotion = useReducedMotion()
  const isProcessing = useProcessingState((s) => s.isProcessing)
  const frozenRef = useRef(false)

  useEffect(() => {
    frozenRef.current = !!prefersReducedMotion || isProcessing
  }, [prefersReducedMotion, isProcessing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    blobsRef.current = [
      { x: 0.18, y: 0.22, vx: 0.00018, vy: 0.00012, radius: 0.42, color: '99,102,241' }, // indigo
      { x: 0.82, y: 0.28, vx: -0.00014, vy: 0.0002, radius: 0.36, color: '139,92,246' }, // violet
      { x: 0.55, y: 0.8, vx: 0.00016, vy: -0.00013, radius: 0.4, color: '129,140,248' }, // light indigo
    ]

    const render = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (const blob of blobsRef.current) {
        if (!frozenRef.current) {
          blob.x += blob.vx
          blob.y += blob.vy
          if (blob.x < 0.08 || blob.x > 0.92) blob.vx *= -1
          if (blob.y < 0.08 || blob.y > 0.92) blob.vy *= -1
          blob.x = Math.max(0.08, Math.min(0.92, blob.x))
          blob.y = Math.max(0.08, Math.min(0.92, blob.y))
        }

        const r = blob.radius * Math.min(w, h)
        const grad = ctx.createRadialGradient(blob.x * w, blob.y * h, 0, blob.x * w, blob.y * h, r)
        grad.addColorStop(0, `rgba(${blob.color},0.45)`)
        grad.addColorStop(0.5, `rgba(${blob.color},0.16)`)
        grad.addColorStop(1, `rgba(${blob.color},0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(blob.x * w, blob.y * h, r, 0, Math.PI * 2)
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70 dark:opacity-50"
      style={{ filter: 'blur(72px)' }}
    />
  )
}
