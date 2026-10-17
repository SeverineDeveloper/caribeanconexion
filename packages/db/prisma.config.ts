import path from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// El .env vive en la raíz del monorepo; en producción las variables llegan del contenedor.
config({ path: path.join(import.meta.dirname, "../../.env"), quiet: true });

export default defineConfig({
  schema: path.join(import.meta.dirname, "prisma/schema.prisma"),
  migrations: {
    path: path.join(import.meta.dirname, "prisma/migrations"),
  },
  // Sin env() estricto: `prisma generate` (install, CI, Docker) no necesita base de datos.
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
