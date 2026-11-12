import { parseInlineLinks } from "@cc/core";
import { Link } from "@/i18n/navigation";

/** Texto con enlaces internos `[texto](/ruta)`; el idioma lo añade el Link de next-intl. */
export function RichText({ text }: { text: string }) {
  return parseInlineLinks(text).map((part, i) =>
    part.type === "link" ? (
      <Link
        // biome-ignore lint/suspicious/noArrayIndexKey: partes fijas de un texto estático
        key={i}
        href={part.href}
        className="font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition-colors hover:text-teal-800 hover:decoration-teal-600"
      >
        {part.text}
      </Link>
    ) : (
      part.text
    ),
  );
}
