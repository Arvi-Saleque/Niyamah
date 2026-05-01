import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Niyamah",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1
        className="text-3xl font-semibold sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Last updated: {new Date().getFullYear()}
      </p>

      <section className="mt-8 space-y-6 text-sm leading-7 text-[var(--color-text-secondary)]">
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            What we collect
          </h2>
          <p>
            We collect information you provide directly (name, email, phone,
            shipping address) and limited usage data (pages viewed, device
            type) to operate and improve the Service.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            How we use it
          </h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Process and deliver your orders</li>
            <li>Provide customer support</li>
            <li>Send transactional emails (order confirmation, shipping)</li>
            <li>Marketing emails — only if you opt in</li>
            <li>Detect fraud and abuse</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            Sharing
          </h2>
          <p>
            We share data only with trusted service providers (payment
            processors, shipping carriers, email providers) under strict
            confidentiality agreements. We do not sell your personal data.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            Cookies
          </h2>
          <p>
            We use essential cookies for authentication and cart sessions, plus
            optional analytics cookies you can disable in your browser.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            Your rights
          </h2>
          <p>
            You may request access, correction, or deletion of your personal
            data at any time by emailing{" "}
            <a className="underline" href="mailto:privacy@niyamah.com">
              privacy@niyamah.com
            </a>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
