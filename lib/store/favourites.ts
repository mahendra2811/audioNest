'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavouritesState {
  favourites: string[]
  toggle: (slug: string) => void
  isFavourite: (slug: string) => boolean
}

export const useFavourites = create<FavouritesState>()(
  persist(
    (set, get) => ({
      favourites: [],
      toggle: (slug) =>
        set((state) => ({
          favourites: state.favourites.includes(slug)
            ? state.favourites.filter((s) => s !== slug)
            : [...state.favourites, slug],
        })),
      isFavourite: (slug) => get().favourites.includes(slug),
    }),
    { name: 'audionest-favourites' }
  )
)
