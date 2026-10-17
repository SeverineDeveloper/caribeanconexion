# Aplica migraciones de Prisma antes de cada despliegue (servicio "migrate" del compose).
FROM node:24-alpine
RUN corepack enable pnpm
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/db packages/db
RUN pnpm install --frozen-lockfile --filter @cc/db --ignore-scripts
WORKDIR /repo/packages/db
CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]
