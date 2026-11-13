import { describe, expect, it } from "vitest";
import { parseInlineLinks, stripInlineLinks } from "./inline-links";

describe("parseInlineLinks", () => {
  it("separa texto y enlaces internos", () => {
    expect(parseInlineLinks("Mira [la excursión](/excursiones/buggies) hoy.")).toEqual([
      { type: "text", text: "Mira " },
      { type: "link", text: "la excursión", href: "/excursiones/buggies" },
      { type: "text", text: " hoy." },
    ]);
  });

  it("acepta varios enlaces y un enlace al principio o al final", () => {
    expect(parseInlineLinks("[A](/a) y [B](/b)")).toEqual([
      { type: "link", text: "A", href: "/a" },
      { type: "text", text: " y " },
      { type: "link", text: "B", href: "/b" },
    ]);
  });

  it("deja como texto los destinos externos o peligrosos", () => {
    for (const href of ["https://otro.com", "//otro.com", "javascript:alert(1)", "mailto:a@b.c"]) {
      const input = `Ver [aquí](${href}).`;
      expect(parseInlineLinks(input)).toEqual([{ type: "text", text: input }]);
    }
  });

  it("devuelve el texto tal cual si no hay enlaces", () => {
    expect(parseInlineLinks("Sin enlaces")).toEqual([{ type: "text", text: "Sin enlaces" }]);
    expect(parseInlineLinks("")).toEqual([]);
  });
});

describe("stripInlineLinks", () => {
  it("quita la sintaxis y conserva el texto del enlace", () => {
    expect(stripInlineLinks("Reserva [Isla Saona](/excursiones) ya.")).toBe(
      "Reserva Isla Saona ya.",
    );
  });
});
