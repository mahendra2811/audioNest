import type { Metadata } from 'next'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'How AudioNest Works — 100% In-Browser Audio Processing',
}

const steps = [
  {
    number: '1',
    title: 'Drop your file',
    body: 'Select or drag an audio file directly from your device. It stays on your device — nothing is sent to any server.',
  },
  {
    number: '2',
    title: 'Process in your browser',
    body: 'AudioNest uses WebAssembly (ffmpeg.wasm) and the Web Audio API to process your file entirely inside your browser tab, using your CPU.',
  },
  {
    number: '3',
    title: 'Download your result',
    body: "Get your processed file instantly. No watermark, no account, no waiting. Close the tab and it's gone — we never had it.",
  },
]

const sections = [
  {
    title: 'Why this matters for privacy',
    body: "Most online tools upload your audio to their servers to process it. AudioNest never does. Your files are never transmitted, stored, or seen by anyone — they exist only in your browser's memory for the duration of processing, then the memory is freed.",
  },
  {
    title: 'A note on quality',
    body: "Converting between formats can reduce quality. Converting from a lossless format (WAV, FLAC) to a lossy format (MP3, AAC) is a one-way process — you cannot fully recover the original quality. AudioNest is honest about this and shows a warning when you're about to do a lossy conversion.",
  },
  {
    title: 'Free, forever',
    body: 'AudioNest is completely free. No sign-up, no watermark, no hidden limits. We may show small non-intrusive ads to cover hosting costs, but processing is always free and always on-device.',
  },
]

export default function HowItWorksPage() {
  return (
    <Container size="narrow" className="py-16">
      <h1 className="mb-10 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
        How AudioNest works
      </h1>

      <ol className="mb-16 flex flex-col gap-4">
        {steps.map((step) => (
          <li key={step.number}>
            <Card className="flex items-start gap-5 p-6">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-bold text-tint"
              >
                {step.number}
              </span>
              <div>
                <h2 className="mb-1 text-lg font-semibold text-fg">{step.title}</h2>
                <p className="leading-relaxed text-muted">{step.body}</p>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-3 text-xl font-semibold text-fg">{s.title}</h2>
            <p className="leading-relaxed text-muted">{s.body}</p>
          </section>
        ))}
      </div>
    </Container>
  )
}
