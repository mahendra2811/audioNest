import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About AudioNest — Free, Private, Browser-Based Audio Tools',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">About AudioNest</h1>

      <p className="text-lg leading-relaxed mb-12">
        AudioNest is a free, privacy-first audio toolkit that runs entirely in your browser. No
        uploads. No accounts. No subscriptions. Just tools that work.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">The idea</h2>
        <p className="leading-relaxed">
          We built AudioNest because most audio tools online make you upload your files to process
          them. That&apos;s fine for most tasks — but it means your recordings, podcasts, music, and
          voice notes pass through someone else&apos;s server. AudioNest is different: everything
          happens in your browser tab, using your device&apos;s own CPU.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">The technology</h2>
        <p className="leading-relaxed">
          AudioNest uses ffmpeg.wasm — a full port of FFmpeg to WebAssembly — for format conversion,
          cutting, joining, and more. For analysis and effects, we use the Web Audio API built into
          every modern browser. Neither requires a server.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">The tools</h2>
        <p className="leading-relaxed">
          Today, AudioNest has 24 tools covering cutting, converting, cleaning, volume adjustment,
          effects, channel manipulation, analysis, metadata editing, and creation. More are on the
          way — see the Coming Soon section on the home page.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Who built it</h2>
        <p className="leading-relaxed">
          AudioNest is an independent project. If you find it useful, share it with someone who
          could use it.
        </p>
      </section>
    </div>
  )
}
