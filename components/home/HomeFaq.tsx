import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { Accordion } from '@/components/ui/Accordion'
import { Card } from '@/components/ui/Card'
import { homeFaqs } from '@/lib/config/faqs'
import { SITE_NAME, SITE_URL } from '@/lib/site'

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}

export function HomeFaq() {
  return (
    <section aria-labelledby="faq-heading">
      <JsonLd data={homeJsonLd} />
      <h2 id="faq-heading" className="mb-4 text-xl font-bold text-fg">
        Frequently Asked Questions
      </h2>
      <Card inset className="px-5 py-1">
        <Accordion items={homeFaqs} allowMultiple />
      </Card>
      <p className="mt-3 text-xs text-muted">
        Have more questions?{' '}
        <Link href={`${SITE_URL}/blog`} className="text-primary hover:underline">
          Read our guides
        </Link>{' '}
        or explore all free tools on{' '}
        <Link href="/" className="text-primary hover:underline">
          {SITE_NAME}
        </Link>
        .
      </p>
    </section>
  )
}
