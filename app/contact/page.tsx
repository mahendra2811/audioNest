'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { GlassCard } from '@/components/glass/GlassCard';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = 'idle' | 'sending' | 'done' | 'error';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ID) return;

    setStatus('sending');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('done');
        toast.success('Message sent! We\'ll get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        toast.error('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      toast.error('Network error. Please check your connection and try again.');
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main className="min-h-screen px-4 py-16 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <h1 className="text-4xl font-bold text-white mb-3 text-center">Contact</h1>
        <p className="text-white/60 text-center mb-10 text-sm leading-relaxed">
          Have a question, suggestion, or found a bug? We&apos;d love to hear from you.
        </p>

        <GlassCard className="p-8">
          {status === 'done' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✉️</div>
              <p className="text-white font-medium text-lg">
                Thanks for reaching out! We&apos;ll get back to you soon.
              </p>
            </div>
          ) : FORMSPREE_ID ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-white/70 text-xs font-medium uppercase tracking-wide">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-white/70 text-xs font-medium uppercase tracking-wide">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-white/70 text-xs font-medium uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-2.5 rounded-xl text-white font-semibold text-sm
                  bg-gradient-to-r from-orange-500 to-orange-400
                  hover:from-orange-400 hover:to-orange-300
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70 text-sm mb-6">
                The contact form is not configured yet. Reach us directly at:
              </p>
              <a
                href="mailto:hello@audionest.app"
                className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm
                  bg-gradient-to-r from-orange-500 to-orange-400
                  hover:from-orange-400 hover:to-orange-300
                  transition-all duration-200"
              >
                hello@audionest.app
              </a>
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
