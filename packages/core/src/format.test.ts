import { describe, expect, it } from "vitest";
import { formatDuration, formatTime, formatUsd } from "./format";

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
