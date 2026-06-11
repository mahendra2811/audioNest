'use client'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useProcessingState } from '@/lib/store/processing'

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  phase: number
  speed: number
}

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

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize 4 blobs
    blobsRef.current = [
      { x: 0.2, y: 0.3, vx: 0.0003, vy: 0.0002, radius: 0.38, color: '#FF8C00', phase: 0, speed: 1 },
      { x: 0.75, y: 0.2, vx: -0.0002, vy: 0.0003, radius: 0.32, color: '#FFD700', phase: 1.5, speed: 0.8 },
      { x: 0.5, y: 0.75, vx: 0.0002, vy: -0.0002, radius: 0.35, color: '#FF6B00', phase: 3, speed: 1.2 },
      { x: 0.85, y: 0.65, vx: -0.0003, vy: -0.0001, radius: 0.28, color: '#FFAA00', phase: 4.5, speed: 0.9 },
    ]

    let time = 0

    const drawGrain = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const grainAmount = 8
      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * grainAmount
        data[i] = Math.min(255, Math.max(0, data[i] + grain))
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain))
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain))
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const render = () => {
      const w = canvas.width
      const h = canvas.height

      // Background
      ctx.fillStyle = '#FFFBF5'
      ctx.fillRect(0, 0, w, h)

      if (!frozenRef.current) {
        time += 0.005
      }

      // Draw blobs
      for (const blob of blobsRef.current) {
        if (!frozenRef.current) {
          // Drift
          blob.x += blob.vx * blob.speed
          blob.y += blob.vy * blob.speed
          // Bounce
          if (blob.x < 0.05 || blob.x > 0.95) blob.vx *= -1
          if (blob.y < 0.05 || blob.y > 0.95) blob.vy *= -1
          // Clamp
          blob.x = Math.max(0.05, Math.min(0.95, blob.x))
          blob.y = Math.max(0.05, Math.min(0.95, blob.y))
        }

        const morphOffset = !frozenRef.current
          ? Math.sin(time + blob.phase) * 0.06
          : 0
        const r = (blob.radius + morphOffset) * Math.min(w, h)

        const grad = ctx.createRadialGradient(blob.x * w, blob.y * h, 0, blob.x * w, blob.y * h, r)
        grad.addColorStop(0, blob.color + 'CC')
        grad.addColorStop(0.4, blob.color + '66')
        grad.addColorStop(1, blob.color + '00')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(blob.x * w, blob.y * h, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Apply a heavy blur effect via CSS — canvas stays sharp, CSS does the blur
      // Add ~4% film grain
      drawGrain()

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
      aria-hidden="true"
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ filter: 'blur(80px) saturate(1.3)', willChange: 'transform' }}
    />
  )
}
