'use client'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/Section'
import { featuredTools } from '@/lib/config/tools'
import { ToolCard } from './ToolCard'

export function FeaturedGrid() {
  const displayed = featuredTools.slice(0, 8)

  return (
    <section>
      <SectionHeading
        eyebrow="Most used"
        title="Featured tools"
        subtitle="The audio tools people reach for most — all running right in your browser."
        className="mb-8"
      />
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {displayed.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </motion.div>
    </section>
  )
}
