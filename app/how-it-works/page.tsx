import type { Metadata } from 'next'
import { GlassCard } from '@/components/glass/GlassCard'

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
    body: 'Get your processed file instantly. No watermark, no account, no waiting. Close the tab and it\'s gone — we never had it.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-12 text-[#1A1208] dark:text-[#FFF8ED]">
        How AudioNest works
      </h1>

      {/* 3 steps */}
      <ol className="flex flex-col gap-6 mb-16">
        {steps.map((step) => (
          <li key={step.number}>
            <GlassCard intensity="medium" className="p-6 flex gap-5 items-start">
              <span
                aria-hidden="true"
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-amber-800 dark:text-amber-300"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,140,0,0.25) 0%, rgba(255,215,0,0.18) 100%)',
                }}
              >
                {step.number}
              </span>
              <div>
                <h2 className="text-lg font-semibold mb-1 text-[#1A1208] dark:text-[#FFF8ED]">
                  {step.title}
                </h2>
                <p className="text-[#4A3B1F] dark:text-[#C8B38A] leading-relaxed">
                  {step.body}
                </p>
              </div>
            </GlassCard>
          </li>
        ))}
      </ol>

      {/* Why this matters for privacy */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-[#1A1208] dark:text-[#FFF8ED]">
          Why this matters for privacy
        </h2>
        <p className="text-[#4A3B1F] dark:text-[#C8B38A] leading-relaxed">
          Most online tools upload your audio to their servers to process it. AudioNest never does.
          Your files are never transmitted, stored, or seen by anyone — they exist only in your
          browser's memory for the duration of processing, then the memory is freed.
        </p>
      </section>

      {/* A note on quality */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-[#1A1208] dark:text-[#FFF8ED]">
          A note on quality
        </h2>
        <p className="text-[#4A3B1F] dark:text-[#C8B38A] leading-relaxed">
          Converting between formats can reduce quality. Converting from a lossless format (WAV,
          FLAC) to a lossy format (MP3, AAC) is a one-way process — you cannot fully recover the
          original quality. AudioNest is honest about this and shows a warning when you're about to
          do a lossy conversion.
        </p>
      </section>

      {/* Free, forever */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-3 text-[#1A1208] dark:text-[#FFF8ED]">
          Free, forever
        </h2>
        <p className="text-[#4A3B1F] dark:text-[#C8B38A] leading-relaxed">
          AudioNest is completely free. No sign-up, no watermark, no hidden limits. We may show
          small non-intrusive ads to cover hosting costs, but processing is always free and always
          on-device.
        </p>
      </section>
    </div>
  )
}
