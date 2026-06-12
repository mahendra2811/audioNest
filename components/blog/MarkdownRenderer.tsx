import Link from 'next/link'
import type { ReactNode } from 'react'

/** Parse inline markdown (bold, italic, code, links) into React nodes. */
function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = []
  let rest = text
  let key = 0

  while (rest.length > 0) {
    // Bold: **text**
    const bold = rest.match(/^(.*?)\*\*(.+?)\*\*(.*)$/)
    if (bold) {
      if (bold[1]) parts.push(bold[1])
      parts.push(<strong key={key++}>{bold[2]}</strong>)
      rest = bold[3]
      continue
    }
    // Italic: *text*
    const italic = rest.match(/^(.*?)\*(.+?)\*(.*)$/)
    if (italic) {
      if (italic[1]) parts.push(italic[1])
      parts.push(<em key={key++}>{italic[2]}</em>)
      rest = italic[3]
      continue
    }
    // Inline code: `code`
    const code = rest.match(/^(.*?)`(.+?)`(.*)$/)
    if (code) {
      if (code[1]) parts.push(code[1])
      parts.push(
        <code key={key++} className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-fg">
          {code[2]}
        </code>
      )
      rest = code[3]
      continue
    }
    // Link: [text](url)
    const link = rest.match(/^(.*?)\[([^\]]+)\]\(([^)]+)\)(.*)$/)
    if (link) {
      if (link[1]) parts.push(link[1])
      const href = link[3]
      const isExternal = href.startsWith('http')
      parts.push(
        isExternal ? (
          <a
            key={key++}
            href={href}
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link[2]}
          </a>
        ) : (
          <Link
            key={key++}
            href={href}
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {link[2]}
          </Link>
        )
      )
      rest = link[4]
      continue
    }
    // No more patterns — emit the rest as-is
    parts.push(rest)
    break
  }
  return parts
}

type Block =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'blank' }

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() })
      i++
    } else if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() })
      i++
    } else if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2).trim() })
      i++
    } else if (line.startsWith('| ')) {
      // Collect table lines
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const parseCells = (l: string) =>
        l
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim())
      const headers = parseCells(tableLines[0])
      const rows = tableLines
        .slice(2) // skip separator row (---)
        .map(parseCells)
        .filter((r) => r.length > 0)
      blocks.push({ type: 'table', headers, rows })
    } else if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].slice(2).trim())
        i++
      }
      blocks.push({ type: 'ul', items })
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, '').trim())
        i++
      }
      blocks.push({ type: 'ol', items })
    } else if (!line.trim()) {
      blocks.push({ type: 'blank' })
      i++
    } else {
      blocks.push({ type: 'p', text: line.trim() })
      i++
    }
  }

  return blocks
}

interface Props {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: Props) {
  const blocks = parseBlocks(content)

  return (
    <div className={className ?? 'blog-content'}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1 key={idx} className="mb-4 mt-8 text-2xl font-bold text-fg first:mt-0">
                {parseInline(block.text)}
              </h1>
            )
          case 'h2':
            return (
              <h2 key={idx} className="mb-3 mt-8 text-xl font-bold text-fg first:mt-0">
                {parseInline(block.text)}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={idx} className="mb-2 mt-6 text-base font-semibold text-fg">
                {parseInline(block.text)}
              </h3>
            )
          case 'p':
            return (
              <p key={idx} className="mb-4 text-sm leading-relaxed text-muted">
                {parseInline(block.text)}
              </p>
            )
          case 'ul':
            return (
              <ul key={idx} className="mb-4 list-disc pl-5 text-sm leading-relaxed text-muted">
                {block.items.map((item, j) => (
                  <li key={j} className="mb-1">
                    {parseInline(item)}
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={idx} className="mb-4 list-decimal pl-5 text-sm leading-relaxed text-muted">
                {block.items.map((item, j) => (
                  <li key={j} className="mb-1">
                    {parseInline(item)}
                  </li>
                ))}
              </ol>
            )
          case 'table':
            return (
              <div key={idx} className="mb-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                        >
                          {parseInline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-b border-line/50">
                        {row.map((cell, k) => (
                          <td key={k} className="py-2 pr-4 text-sm text-fg">
                            {parseInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'blank':
            return null
          default:
            return null
        }
      })}
    </div>
  )
}
