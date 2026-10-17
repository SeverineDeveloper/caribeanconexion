# Infraestructura

Un VPS con Docker aloja **production** y **staging**. Cada entorno tiene su propia base de datos. Caddy, compartido entre ambos, sirve el TLS y hace de proxy:

```
Cloudflare (DNS/CDN) → Caddy :443 ─┬─ dominio          → web-production:3000
                                   └─ staging.dominio  → web-staging:3000 (con basic auth)
cc-production: db · migrate · web · worker
cc-staging:    db · migrate · web · worker
```

## Preparar el VPS (una sola vez)

1. Instalar Ubuntu LTS y Docker Engine con el plugin compose.
2. Configurar el firewall para dejar abiertos solo los puertos 22, 80 y 443.
3. Crear un usuario `deploy` (en el grupo `docker`) con acceso SSH por clave. Sin contraseña.
4. Crear las carpetas y la red compartida:
   ```bash
   sudo mkdir -p /srv/cc/app && sudo chown -R deploy /srv/cc
   docker network create edge
   ```
5. Crear `/srv/cc/production.env` y `/srv/cc/staging.env` a partir de `infra/app.env.example` (permisos `600`).
6. Crear `/srv/cc/caddy.env` con `DOMAIN`, `ACME_EMAIL`, `STAGING_USER` y `STAGING_PASSWORD_HASH`. El hash se genera con `docker run --rm caddy:2-alpine caddy hash-password`.
7. Iniciar sesión en GHCR (token con `read:packages`): `docker login ghcr.io`.
8. Copiar `infra/` a `/srv/cc/app/infra` y levantar Caddy:
   ```bash
   docker compose -f /srv/cc/app/infra/caddy/docker-compose.yml --env-file /srv/cc/caddy.env up -d
   ```
9. En Cloudflare: registros A del dominio y de `staging` apuntando al VPS, con SSL en modo **Full (strict)**.

## Despliegue

GitHub Actions (`.github/workflows/deploy.yml`) se encarga de todo:
- Construye las imágenes `cc-web`, `cc-worker` y `cc-migrate` y las sube a GHCR.
- Copia `infra/` al VPS por SSH.
- Ejecuta `docker compose up`. El servicio `migrate` aplica `prisma migrate deploy` antes de arrancar web y worker.

Cada push a `main` despliega en **staging**. **Production** se lanza a mano (workflow_dispatch).

Secretos y variables por entorno en GitHub (Settings → Environments):
- Secretos: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` y `VPS_KNOWN_HOSTS` (el resultado de `ssh-keyscan <host>`).
- Variables: `SITE_URL`, `WHATSAPP_NUMBER` y `SENTRY_DSN`.

## Primer administrador

**Pendiente (M6):** crear el primer usuario en producción con una imagen o comando dedicado. Hoy `pnpm admin:create` solo corre desde el repositorio, con `DATABASE_URL` apuntando a la base. Por ejemplo, en un contenedor puntual unido a la red `cc-<entorno>_default`, con una copia del repo y `DATABASE_URL=postgresql://…@db:5432/…`.

## Backups

El cron del host lanza el backup diario (pg_dump → R2, con 30 días de retención):

```cron
15 3 * * * cd /srv/cc/app && docker compose -p cc-production --env-file /srv/cc/production.env -f infra/docker-compose.app.yml --profile tools run --rm backup >> /var/log/cc-backup.log 2>&1
```

Cada mes hay que probar la restauración: `pg_restore` del último volcado en una base temporal.
