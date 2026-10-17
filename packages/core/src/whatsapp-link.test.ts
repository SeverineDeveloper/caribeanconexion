import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, extractOriginCode, formatPhoneDisplay } from "./whatsapp-link";

describe("formatPhoneDisplay", () => {
  it("formatea números de RD y EE. UU.", () => {
    expect(formatPhoneDisplay("18296313468")).toBe("+1 829-631-3468");
  });

  it("deja otros países solo con el prefijo +", () => {
    expect(formatPhoneDisplay("573001234567")).toBe("+573001234567");
  });
});

describe("buildWhatsAppUrl", () => {
  it("normaliza el número y codifica el mensaje", () => {
    const url = buildWhatsAppUrl("+1 829-631-3468", "Hola Conexión Caribe");
    expect(url).toBe("https://wa.me/18296313468?text=Hola%20Conexi%C3%B3n%20Caribe");
  });

  it("añade el código de origen al final", () => {
    const url = buildWhatsAppUrl("18296313468", "Me interesa Isla Saona", "CC-EXC-SAONA");
    expect(decodeURIComponent(url.split("text=")[1] ?? "")).toBe(
      "Me interesa Isla Saona [CC-EXC-SAONA]",
    );
  });

  it("rechaza números inválidos", () => {
    expect(() => buildWhatsAppUrl("123", "hola")).toThrow();
  });
});

describe("extractOriginCode", () => {
  it("lee el código que generó el botón", () => {
    expect(extractOriginCode("Me interesa Isla Saona [CC-EXC-SAONA]")).toBe("CC-EXC-SAONA");
  });

  it("devuelve null en mensajes libres", () => {
    expect(extractOriginCode("hola, quiero info [algo]")).toBeNull();
  });
});
