import { describe, expect, it } from "vitest";
import {
  formatDateLong,
  formatDuration,
  formatList,
  formatTime,
  formatUsd,
  tidyPunctuation,
} from "./format";

// Intl usa espacios finos o duros según el idioma; se comparan como espacios normales.
const plain = (s: string) => s.replace(/[  ]/g, " ");

describe("formatUsd", () => {
  it("muestra dólares estadounidenses sin decimales en cada idioma", () => {
    expect(plain(formatUsd(37, "es"))).toBe("US$37");
    expect(plain(formatUsd(37, "en"))).toBe("US$37");
    expect(plain(formatUsd(37, "fr"))).toBe("37 $US");
  });

  it("redondea los centavos", () => {
    expect(plain(formatUsd(54.6, "es"))).toBe("US$55");
  });
});

describe("formatTime", () => {
  it("formatea la hora según el idioma", () => {
    expect(plain(formatTime("08:30", "es"))).toBe("8:30 a. m.");
    expect(plain(formatTime("15:00", "en"))).toBe("3:00 PM");
    expect(plain(formatTime("15:00", "fr"))).toBe("15:00");
  });

  it("rechaza horas mal escritas", () => {
    expect(() => formatTime("8:30", "es")).toThrow();
    expect(() => formatTime("24:00", "es")).toThrow();
  });
});

describe("formatDuration", () => {
  it("usa horas y minutos", () => {
    expect(formatDuration(240)).toBe("4 h");
    expect(formatDuration(210)).toBe("3 h 30 min");
    expect(formatDuration(45)).toBe("45 min");
  });

  it("rechaza duraciones no positivas", () => {
    expect(() => formatDuration(0)).toThrow();
  });
});

describe("formatList", () => {
  it("enumera con la conjunción de cada idioma", () => {
    expect(formatList(["8:00", "11:00", "14:00"], "es")).toBe("8:00, 11:00 y 14:00");
    expect(formatList(["8:00", "11:00", "14:00"], "en")).toBe("8:00, 11:00, and 14:00");
    expect(formatList(["8:00", "11:00", "14:00"], "fr")).toBe("8:00, 11:00 et 14:00");
  });

  it("no añade conjunción con un solo elemento", () => {
    expect(formatList(["Guía"], "es")).toBe("Guía");
  });
});

describe("formatDateLong", () => {
  it("escribe la fecha completa en cada idioma, sin correrse de día", () => {
    expect(formatDateLong("2026-11-12", "es")).toBe("12 de noviembre de 2026");
    expect(formatDateLong("2026-11-12", "en")).toBe("November 12, 2026");
    expect(formatDateLong("2026-11-12", "fr")).toBe("12 novembre 2026");
  });

  it("rechaza fechas mal escritas", () => {
    expect(() => formatDateLong("12/11/2026", "es")).toThrow();
  });
});

describe("tidyPunctuation", () => {
  it("quita el punto doble tras una abreviatura al final de frase", () => {
    expect(tidyPunctuation("Salidas a las 8:00 a. m. y 2:00 p. m.. Incluye guía.")).toBe(
      "Salidas a las 8:00 a. m. y 2:00 p. m. Incluye guía.",
    );
    expect(tidyPunctuation("Hasta las 6:00 p. m..")).toBe("Hasta las 6:00 p. m.");
  });

  it("no toca los puntos suspensivos ni el texto normal", () => {
    expect(tidyPunctuation("Y más...")).toBe("Y más...");
    expect(tidyPunctuation("Sin cambios.")).toBe("Sin cambios.");
  });
});
