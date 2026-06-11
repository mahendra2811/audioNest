'use client'
import { create } from 'zustand'

interface ProcessingState {
  isProcessing: boolean
  start: () => void
  end: () => void
}

export const useProcessingState = create<ProcessingState>((set) => ({
  isProcessing: false,
  start: () => set({ isProcessing: true }),
  end: () => set({ isProcessing: false }),
}))
