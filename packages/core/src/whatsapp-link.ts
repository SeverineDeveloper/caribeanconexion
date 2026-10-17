/**
 * Enlace click-to-chat de WhatsApp con mensaje precargado.
 * El código de origen (p. ej. "CC-EXC-SAONA") permite al bot y al agente saber
 * desde qué botón o ficha llegó el cliente.
 */
export function buildWhatsAppUrl(phone: string, message: string, originCode?: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) {
    throw new Error(`Número de WhatsApp inválido: "${phone}"`);
  }
  const text = originCode ? `${message.trim()} [${originCode}]` : message.trim();
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** "18296313468" → "+1 829-631-3468" (plan de numeración de Norteamérica); otros, "+<dígitos>". */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const nanp = /^1(\d{3})(\d{3})(\d{4})$/.exec(digits);
  return nanp ? `+1 ${nanp[1]}-${nanp[2]}-${nanp[3]}` : `+${digits}`;
}

const ORIGIN_CODE_PATTERN = /\[(CC-[A-Z0-9-]+)\]\s*$/;

/** Extrae el código de origen del primer mensaje del cliente, si lo trae. */
export function extractOriginCode(message: string): string | null {
  return ORIGIN_CODE_PATTERN.exec(message.trim())?.[1] ?? null;
}
