/**
 * JsonLd — renders schema.org structured data as a <script type="application/ld+json">.
 *
 * SECURITY: `dangerouslySetInnerHTML` is safe here because `data` is always a
 * plain JS object produced entirely by our own code (never user input).
 * JSON.stringify serialises it to a JSON string — no HTML tags, no script
 * injection vectors. This is the canonical Next.js pattern for JSON-LD.
 *
 * Do NOT pass untrusted / user-supplied objects to this component.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: safe — serialised from internal static data only
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
