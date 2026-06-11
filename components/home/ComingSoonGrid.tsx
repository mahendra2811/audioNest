'use client'
import { toast } from 'sonner'
import { SectionHeading } from '@/components/ui/Section'
import { soonTools } from '@/lib/config/tools'
import { ToolCard } from './ToolCard'

export function ComingSoonGrid() {
  return (
    <section>
      <SectionHeading
        eyebrow="On the roadmap"
        title="Coming soon"
        subtitle="More on-device tools are in the works — no uploads there either."
        className="mb-8"
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {soonTools.map((tool) => (
          <ToolCard
            key={tool.slug}
            tool={tool}
            locked
            onClick={() => toast('Coming soon — stay tuned!')}
          />
        ))}
      </div>
    </section>
  )
}
