import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AudioNest",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 px-5 py-4 text-sm text-yellow-800">
        <strong>Disclaimer:</strong> This is a template terms document. Review
        it with a legal professional before relying on it.
      </div>

      <h1 className="mb-2 text-4xl font-bold tracking-tight">
        Terms of Service
      </h1>
      <p className="mb-12 text-sm text-gray-500">Last updated: June 2026</p>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">1. Acceptance</h2>
        <p className="leading-relaxed text-gray-700">
          By using AudioNest, you accept these terms in full. If you do not
          agree with any part of these terms, please do not use the service.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">2. The Service</h2>
        <p className="leading-relaxed text-gray-700">
          AudioNest provides browser-based audio processing tools free of
          charge. All processing happens entirely on your device — your audio
          files are never uploaded to our servers. We make no guarantees of
          uptime, availability, or fitness for any particular purpose.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">
          3. Free Service / As-Is
        </h2>
        <p className="leading-relaxed text-gray-700">
          AudioNest is provided &ldquo;as is&rdquo; without any warranty,
          express or implied, including but not limited to warranties of
          merchantability or fitness for a particular purpose. We are not
          liable for any loss of data or damage of any kind arising from your
          use of the service.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">4. Acceptable Use</h2>
        <p className="leading-relaxed text-gray-700">
          You agree not to use AudioNest to process audio that you do not have
          the rights to use, or for any unlawful purpose. You are solely
          responsible for ensuring that your use of the service complies with
          all applicable laws and third-party rights.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">
          5. Intellectual Property
        </h2>
        <p className="leading-relaxed text-gray-700">
          The AudioNest name, logo, and source code are owned by their
          respective rights holders. Your audio files remain your property at
          all times — we never access, store, or transmit them.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">
          6. Limitation of Liability
        </h2>
        <p className="leading-relaxed text-gray-700">
          To the fullest extent permitted by applicable law, AudioNest and its
          operators shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including but not limited to loss
          of data, loss of profits, or business interruption, arising out of or
          in connection with your use of the service.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">7. Changes to These Terms</h2>
        <p className="leading-relaxed text-gray-700">
          We may update these terms from time to time. When we do, we will
          revise the &ldquo;Last updated&rdquo; date above. Continued use of
          AudioNest after any changes constitutes your acceptance of the
          revised terms.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold">8. Contact</h2>
        <p className="leading-relaxed text-gray-700">
          Questions about these terms? Email us at{" "}
          <a
            href="mailto:mahendrapuniya92@gmail.com"
            className="text-blue-600 underline hover:text-blue-800"
          >
            mahendrapuniya92@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
