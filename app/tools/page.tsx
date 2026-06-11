import type { Metadata } from 'next'
import { ToolCard } from '@/components/home/ToolCard'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/Section'
import { CATEGORIES, liveTools, soonTools } from '@/lib/config/tools'

export const metadata: Metadata = {
  title: 'All Audio Tools',
  description: `Browse all ${liveTools.length} free online audio tools. No upload, 100% private, on-device.`,
}

export default function ToolsPage() {
  return (
    <Container size="wide" className="py-10">
      <SectionHeading
        title="All audio tools"
        subtitle={`${liveTools.length} free tools — 100% private, no upload, works offline.`}
        className="mb-10"
      />

      <div className="flex flex-col gap-12">
        {CATEGORIES.map(({ id, label }) => {
          const catTools = liveTools.filter((t) => t.category === id)
          if (!catTools.length) return null
          return (
            <section key={id} aria-labelledby={`cat-${id}`}>
              <h2 id={`cat-${id}`} className="mb-5 text-lg font-bold tracking-tight text-fg">
                {label}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {catTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )
        })}

        {soonTools.length > 0 && (
          <section aria-labelledby="cat-soon">
            <h2 id="cat-soon" className="mb-5 text-lg font-bold tracking-tight text-fg">
              Coming soon
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {soonTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} locked />
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  )
}
