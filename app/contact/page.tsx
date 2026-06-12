"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Input, Textarea } from "@/components/ui/Field";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Status = "idle" | "sending" | "done" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ID) return;
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("done");
        toast.success("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      toast.error("Network error. Please check your connection.");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <Container size="narrow" className="py-16">
      <h1 className="mb-3 text-center text-4xl font-bold tracking-tight text-fg">Contact</h1>
      <p className="mx-auto mb-10 max-w-md text-center text-sm leading-relaxed text-muted">
        Have a question, suggestion, or found a bug? We&apos;d love to hear from you.
      </p>

      <Card className="mx-auto max-w-lg p-6 sm:p-8">
        {status === "done" ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-5xl">✉️</div>
            <p className="text-lg font-medium text-fg">
              Thanks for reaching out! We&apos;ll get back to you soon.
            </p>
          </div>
        ) : FORMSPREE_ID ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              name="name"
              label="Name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
            <Input
              name="email"
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <Textarea
              name="message"
              label="Message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what's on your mind…"
            />
            <Button type="submit" disabled={status === "sending"} className="w-full">
              {status === "sending" ? "Sending…" : "Send message"}
            </Button>
            {status === "error" && (
              <p className="text-center text-sm text-red-500 dark:text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        ) : (
          <div className="py-8 text-center">
            <p className="mb-6 text-sm text-muted">Reach us directly at:</p>
            <a href="mailto:mahendrapuniya92@gmail.com" className={buttonVariants({ size: "md" })}>
              mahendrapuniya92@gmail.com
            </a>
          </div>
        )}
      </Card>
    </Container>
  );
}
