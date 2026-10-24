import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  it("no permite cerrar el <script> desde un texto", () => {
    const out = serializeJsonLd({ name: "Saona </script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)).toEqual({ name: "Saona </script><script>alert(1)</script>" });
  });
});
