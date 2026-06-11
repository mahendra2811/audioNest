'use client'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { ToolCard } from '@/components/home/ToolCard'
import { buttonVariants } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import type { Tool } from '@/lib/config/tools'
import { getToolBySlug } from '@/lib/config/tools'
import { useFavourites } from '@/lib/store/favourites'

export default function FavouritesPage() {
  const { favourites } = useFavourites()
  const tools = favourites.map(getToolBySlug).filter(Boolean) as Tool[]

  return (
    <Container size="wide" className="py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-fg">Favourites</h1>

      {tools.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 p-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-tint">
            <Heart size={26} />
          </span>
          <p className="max-w-xs text-muted">
            No favourites yet. Tap ♡ on any tool to save it here.
          </p>
          <Link href="/tools" className={buttonVariants({ size: 'md' })}>
            Explore tools
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </Container>
  )
}
