# Imagen de producción de apps/web (Next.js standalone). Contexto de build: raíz del repo.
FROM node:24-alpine AS base
RUN corepack enable pnpm
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/core/package.json packages/core/
COPY packages/db/package.json packages/db/
COPY packages/db/prisma packages/db/prisma
COPY packages/db/prisma.config.ts packages/db/
RUN pnpm install --frozen-lockfile --filter @cc/web...

FROM deps AS build
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @cc/db generate && pnpm --filter @cc/web build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /repo/apps/web/.next/standalone ./
COPY --from=build --chown=app:app /repo/apps/web/.next/static ./apps/web/.next/static
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "apps/web/server.js"]
