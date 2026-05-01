import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Niyamah",
};

export default function TermsPage() {
  return (
    <article className="prose mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1
        className="text-3xl font-semibold sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Last updated: {new Date().getFullYear()}
      </p>

      <section className="mt-8 space-y-6 text-sm leading-7 text-[var(--color-text-secondary)]">
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            1. Acceptance of terms
          </h2>
          <p>
            By accessing or using Niyamah (the &ldquo;Service&rdquo;) you agree
            to be bound by these Terms.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            2. Orders & pricing
          </h2>
          <p>
            All prices are in Bangladeshi Taka (BDT) and inclusive of applicable
            taxes. We reserve the right to refuse or cancel any order at our
            discretion.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            3. Shipping & delivery
          </h2>
          <p>
            Estimated delivery times are listed at checkout. We are not liable
            for delays caused by carriers or events outside our control.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            4. Returns
          </h2>
          <p>
            See our{" "}
            <a className="underline" href="/refund">
              Refund Policy
            </a>{" "}
            for details on returns, exchanges and refunds.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            5. Intellectual property
          </h2>
          <p>
            All content, designs and trademarks on this site are property of
            Niyamah and may not be reproduced without permission.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            6. Contact
          </h2>
          <p>
            Questions? Email{" "}
            <a className="underline" href="mailto:hello@niyamah.com">
              hello@niyamah.com
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
