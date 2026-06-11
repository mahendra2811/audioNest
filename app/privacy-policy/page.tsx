import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — AudioNest',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted mb-8">Last updated: June 2025</p>

      <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 mb-10 text-sm text-amber-700 dark:text-amber-300">
        <strong>Disclaimer:</strong> This is a template policy. Review it with a legal professional
        before relying on it.
      </div>

      <div className="space-y-10 text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3">No audio ever leaves your device</h2>
          <p>
            This is the core principle behind AudioNest. Your audio files are processed entirely
            within your browser using WebAssembly and the Web Audio API. At no point are your files
            transmitted to any server, stored in any database, or seen by anyone other than you.
            When you close your browser tab, any data held in memory is gone. AudioNest cannot
            access your files even if it wanted to.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Analytics</h2>
          <p>
            If analytics are enabled (this is environment-dependent and may not apply to the
            instance you are using), AudioNest may use privacy-respecting analytics — such as Google
            Analytics or a similar service — to understand aggregate usage patterns, for example
            which tools are most popular or which browsers are in use. No personally identifiable
            information is collected from your audio processing activity. Aggregate analytics data
            never includes the content of your files or the results of any processing.
          </p>
          <p className="mt-3">
            If you prefer not to be counted, any standard ad-blocker or tracker-blocker (uBlock
            Origin, Privacy Badger, Brave Shields, etc.) will prevent analytics requests from
            reaching third-party servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact form</h2>
          <p>
            If you use the contact form on this site, your name, email address, and message are sent
            via Formspree (a third-party form service) when Formspree is configured in the
            deployment. Formspree's own{' '}
            <a
              href="https://formspree.io/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary"
            >
              privacy policy
            </a>{' '}
            applies to data you submit through it.
          </p>
          <p className="mt-3">
            If Formspree is not configured, the contact page displays a mailto link instead and no
            data is collected or transmitted through AudioNest — your email client handles the
            message directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Cookies and local storage</h2>
          <p>
            AudioNest does not use tracking cookies. The site may use your browser's{' '}
            <code className="text-sm font-mono bg-surface-2 px-1 py-0.5 rounded">localStorage</code>{' '}
            to persist your favourite tools and your theme preference (light/dark/system) between
            visits. This data never leaves your device and is not accessible to any third party. You
            can clear it at any time through your browser's developer tools or site settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Children</h2>
          <p>
            AudioNest is not directed at children under the age of 13 and does not knowingly collect
            personal information from children. If you believe a child has submitted personal
            information through this site, please contact us at the address below and we will take
            steps to remove it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Changes to this policy</h2>
          <p>
            We may update this policy from time to time as AudioNest evolves — for example, if new
            features involve new data flows. The latest version will always be available at this
            URL. We will not reduce your privacy protections without clear notice. If you check back
            periodically you will always find the current policy here.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p>
            Questions about this policy or about how AudioNest handles data? Email us at{' '}
            <a
              href="mailto:mahendrapuniya92@gmail.com"
              className="underline underline-offset-2 hover:text-primary"
            >
              mahendrapuniya92@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
