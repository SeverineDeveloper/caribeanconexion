// Exporta la web pública como sitio estático en apps/web/out (vista previa en GitHub Pages).
// El panel (/admin), la API y el proxy necesitan servidor, así que se compila una copia
// temporal sin ellos (apps/.web-export) y el código original no se toca.
// Uso: NEXT_PUBLIC_BASE_PATH=/repo node scripts/export-static.mjs
import { execFileSync } from "node:child_process";
import { cpSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

const web = path.join(import.meta.dirname, "..");
const copy = path.join(web, "../.web-export");
const skip = new Set(
  [
    "node_modules",
    ".next",
    "out",
    "src/app/admin",
    "src/app/api",
    "src/app/[locale]/[...rest]", // 404 dinámico; aquí lo cubre 404.html
    "src/proxy.ts",
  ].map((p) => path.join(web, p)),
);

rmSync(copy, { recursive: true, force: true });
cpSync(web, copy, { recursive: true, filter: (src) => !skip.has(src) });
symlinkSync(path.join(web, "node_modules"), path.join(copy, "node_modules"), "junction");

const nextBin = path.join(web, "node_modules/next/dist/bin/next");
execFileSync(process.execPath, [nextBin, "build"], {
  cwd: copy,
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1" },
});

const out = path.join(web, "out");
rmSync(out, { recursive: true, force: true });
cpSync(path.join(copy, "out"), out, { recursive: true });
rmSync(copy, { recursive: true, force: true });

// El cliente pide los segmentos de prefetch como "__next.a.b.txt", pero el export los
// escribe como "__next.a/b.txt": se duplican con el nombre que se pide.
function flattenSegments(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      for (const file of readdirSync(full, { recursive: true, withFileTypes: true })) {
        if (!file.isFile()) continue;
        const rel = path.relative(full, path.join(file.parentPath, file.name));
        cpSync(
          path.join(full, rel),
          path.join(dir, `${entry.name}.${rel.split(path.sep).join(".")}`),
        );
      }
    } else {
      flattenSegments(full);
    }
  }
}
flattenSegments(out);

// Sin proxy, la raíz y las rutas inexistentes redirigen a la versión en español.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const redirect = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${base}/es/"><title>Conexión Caribe</title><a href="${base}/es/">Conexión Caribe</a>`;
writeFileSync(path.join(out, "index.html"), redirect);
writeFileSync(path.join(out, "404.html"), redirect);
writeFileSync(path.join(out, ".nojekyll"), "");
