import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy — Niyamah",
};

export default function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1
        className="text-3xl font-semibold sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Refund & Return Policy
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        Last updated: {new Date().getFullYear()}
      </p>

      <section className="mt-8 space-y-6 text-sm leading-7 text-[var(--color-text-secondary)]">
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            Eligibility window
          </h2>
          <p>
            We accept returns within <strong>7 days</strong> of delivery.
            Items must be unworn, unwashed, and in original packaging with
            tags attached.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            Non-returnable items
          </h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>Custom or made-to-measure pieces</li>
            <li>Items marked &ldquo;Final Sale&rdquo;</li>
            <li>Innerwear and intimates (for hygiene reasons)</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            How to return
          </h2>
          <ol className="ml-5 list-decimal space-y-1">
            <li>
              Email{" "}
              <a className="underline" href="mailto:returns@niyamah.com">
                returns@niyamah.com
              </a>{" "}
              with your order number and reason.
            </li>
            <li>We&apos;ll respond with a return shipping label within 24h.</li>
            <li>
              Pack the item securely and hand it to the courier when scheduled.
            </li>
            <li>
              Refunds are issued within 5 business days of receiving the
              return.
            </li>
          </ol>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-text)]">
            Refund method
          </h2>
          <p>
            COD orders are refunded via bKash to your registered phone number.
            Card and online wallet orders are refunded to the original payment
            method.
          </p>
        </div>
      </section>
    </article>
  );
}
