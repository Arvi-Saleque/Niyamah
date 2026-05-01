import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — Niyamah",
  description:
    "Answers to common questions about ordering, shipping, returns, and more at Niyamah.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "How long does delivery take?",
    a: "Inside Dhaka: 1–2 business days. Outside Dhaka: 3–5 business days. Cash on delivery is available nationwide.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 7 days of delivery for unworn items in original packaging. Custom-tailored items are non-returnable.",
  },
  {
    q: "Do you offer cash on delivery?",
    a: "Yes — COD is available for all districts in Bangladesh. A small risk-verification call may be made for high-value orders.",
  },
  {
    q: "How do I track my order?",
    a: "After checkout you'll receive an email with a tracking link. You can also view live status under Account → My Orders.",
  },
  {
    q: "Are sizes true to label?",
    a: "Each product page includes a size guide with measurements in inches. If unsure, please contact us before ordering.",
  },
  {
    q: "How do I become a wholesale partner?",
    a: "Email hello@niyamah.com with your business details and we'll get back within 2 business days.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1
        className="text-3xl font-semibold sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Frequently asked questions
      </h1>
      <p className="mt-3 text-[var(--color-text-secondary)]">
        Can&apos;t find what you&apos;re looking for? Reach out via{" "}
        <a className="underline" href="/contact">
          our contact page
        </a>
        .
      </p>

      <Accordion type="single" collapsible className="mt-8">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
