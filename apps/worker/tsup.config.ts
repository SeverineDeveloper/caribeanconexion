import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "node",
  target: "node24",
  // Los paquetes del monorepo (@cc/*) son código fuente TS: se incluyen en el bundle.
  noExternal: [/^@cc\//],
  clean: true,
  sourcemap: true,
});
