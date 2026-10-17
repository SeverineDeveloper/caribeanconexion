# Conexión Caribe

Plataforma de Conexión Caribe: web pública multilingüe, panel de gestión y chatbot de WhatsApp.

- Requerimientos: [REQUERIMIENTOS.md](REQUERIMIENTOS.md)
- Plan e hitos: [PLAN.md](PLAN.md)
- Infraestructura y despliegue: [infra/README.md](infra/README.md)

## Estructura

```
apps/web          Next.js 16: web pública (/es, /en, /fr), panel (/admin) y API
apps/worker       Trabajos en segundo plano con pg-boss
packages/core     Lógica de dominio pura (roles, enlaces de WhatsApp…), con tests
packages/db       Esquema Prisma 7 y cliente
infra/            Docker, Caddy, backups y runbook del VPS
```

UI con [HeroUI v3](https://heroui.com) sobre Tailwind 4. Auth del panel con Better Auth: roles admin, sales y operations, y 2FA obligatorio para administradores.

## Desarrollo local

Requisitos: Node ≥ 22.12, pnpm 10 y Docker.

```bash
pnpm install
cp .env.example .env   # completar BETTER_AUTH_SECRET y ADMIN_*
pnpm db:up             # Postgres en localhost:5433
pnpm db:migrate        # aplica migraciones
pnpm admin:create      # crea el primer administrador
pnpm dev               # web en http://localhost:3000 y worker
```

El panel está en http://localhost:3000/admin. En el primer ingreso pide activar el 2FA.

## Comprobaciones

```bash
pnpm lint        # Biome
pnpm typecheck
pnpm test        # Vitest
```
