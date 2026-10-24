import { buildWhatsAppUrl } from "@cc/core";
import { buttonVariants } from "@heroui/styles";
import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import { whatsappNumber } from "@/lib/site";

/** Enlace click-to-chat con mensaje precargado y código de origen (ver @cc/core). */
export function whatsappHref(message: string, originCode: string): string {
  return buildWhatsAppUrl(whatsappNumber, message, originCode);
}

/** Botón de WhatsApp. `onDark` para fondos ink-900 o foto (docs/DESIGN.md §6). */
export function WhatsAppButton({
  message,
  originCode,
  children,
  onDark = false,
  size = "lg",
  className = "",
}: {
  message: string;
  originCode: string;
  children: ReactNode;
  onDark?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const tone = onDark ? "bg-teal-400 text-ink-900 hover:bg-[#2fc0c6]" : "";
  return (
    <a
      href={whatsappHref(message, originCode)}
      target="_blank"
      rel="noopener"
      className={`${buttonVariants({ size })} ${tone} ${className}`}
    >
      <WhatsAppIcon className="size-5" />
      {children}
    </a>
  );
}
