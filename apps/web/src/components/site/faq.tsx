import { Accordion } from "@heroui/react";
import { jsonLd } from "@/lib/json-ld";

export type FaqItem = { q: string; a: string };

/** Preguntas frecuentes en acordeón, con datos estructurados FAQPage para buscadores. */
export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <h2 className="text-display-lg text-ink-900">{title}</h2>
      <Accordion className="rounded-card border border-line bg-white px-2 shadow-card sm:px-4">
        {items.map((item, i) => (
          <Accordion.Item key={item.q} id={`faq-${i}`}>
            <Accordion.Heading className="font-sans">
              <Accordion.Trigger className="gap-4 py-5 text-left font-semibold text-base text-ink-900">
                <span className="min-w-0 flex-1">{item.q}</span>
                <Accordion.Indicator className="shrink-0" />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="pb-5 text-ink-700">{item.a}</Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD escapado con jsonLd()
        dangerouslySetInnerHTML={jsonLd(ld)}
      />
    </div>
  );
}
