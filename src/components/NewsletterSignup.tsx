"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type SubmitState =
  | { status: "idle"; message: "" }
  | { status: "pending"; message: string }
  | { status: "success" | "error"; message: string };

export default function NewsletterSignup() {
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();

    setState({ status: "pending", message: "Submitting your email…" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setState({
          status: "error",
          message: result.message ?? "We could not complete your signup. Please try again.",
        });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message: result.message ?? "You’re on the list. Watch your inbox for Weekly Proof.",
      });
    } catch {
      setState({
        status: "error",
        message: "We could not reach the signup service. Please try again later.",
      });
    }
  }

  return (
    <div className="w-full lg:w-auto">
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={handleSubmit}
        noValidate={false}
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
          aria-describedby="newsletter-privacy newsletter-status"
          disabled={state.status === "pending"}
          className="flex-1 lg:w-72 bg-ink border border-line px-4 py-3.5 text-paper placeholder:text-paper-dim focus:outline-none focus:border-brass disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state.status === "pending"}
          className="font-stamp text-xs uppercase tracking-[0.12em] bg-brass text-ink px-6 py-3.5 hover:bg-brass-bright transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-wait"
        >
          {state.status === "pending" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      <p id="newsletter-privacy" className="text-xs text-paper-dim mt-3 max-w-md">
        By subscribing, you agree to receive Weekly Proof. Read our{" "}
        <Link href="/privacy" className="underline underline-offset-4 hover:text-brass">
          privacy notice
        </Link>
        .
      </p>
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`text-sm mt-3 min-h-5 ${
          state.status === "error" ? "text-brass-bright" : "text-paper"
        }`}
      >
        {state.message}
      </p>
    </div>
  );
}
