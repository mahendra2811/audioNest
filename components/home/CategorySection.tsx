import { CATEGORIES, liveTools } from '@/lib/config/tools'
import { ToolCard } from './ToolCard'

const nonFeaturedTools = liveTools.filter((t) => !t.featured)

export function CategorySection() {
  return (
    <section className="flex flex-col gap-12">
      {CATEGORIES.map((cat) => {
        const tools = nonFeaturedTools.filter((t) => t.category === cat.id)
        if (tools.length === 0) return null

        return (
          <div key={cat.id}>
            <h2 className="mb-5 text-lg font-bold tracking-tight text-fg">{cat.label}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
