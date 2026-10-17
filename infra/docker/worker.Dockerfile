# Imagen de producción de apps/worker. Contexto de build: raíz del repo.
FROM node:24-alpine AS base
RUN corepack enable pnpm
WORKDIR /repo

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile --filter @cc/worker... \
  && pnpm --filter @cc/worker build \
  && pnpm --filter @cc/worker deploy --prod --legacy /out

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /out/node_modules ./node_modules
COPY --from=build --chown=app:app /repo/apps/worker/dist ./dist
COPY --from=build --chown=app:app /repo/apps/worker/package.json ./
USER app
CMD ["node", "dist/index.js"]
