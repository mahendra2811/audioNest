'use client'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
  allowMultiple?: boolean
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : new Set<number>())
      if (prev.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className={cn('divide-y divide-line', className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-fg transition-colors hover:text-primary"
            >
              <span>{item.question}</span>
              <ChevronDown
                size={16}
                className={cn(
                  'shrink-0 text-muted transition-transform duration-200',
                  isOpen && 'rotate-180 text-primary'
                )}
              />
            </button>
            {isOpen && (
              <div className="pb-4 text-sm leading-relaxed text-muted">{item.answer}</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
