#!/bin/sh
# Volcado diario de Postgres a Cloudflare R2 con retención en días.
set -eu

: "${R2_ACCOUNT_ID:?}" "${R2_ACCESS_KEY_ID:?}" "${R2_SECRET_ACCESS_KEY:?}" "${R2_BUCKET:?}"

export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
FILE="/tmp/${PGDATABASE}-${STAMP}.dump"
DEST="r2:${R2_BUCKET}/postgres/${APP_ENV}"

pg_dump --format=custom --no-owner --file="$FILE"
rclone copyto "$FILE" "${DEST}/$(basename "$FILE")"
rm -f "$FILE"
rclone delete --min-age "${RETENTION_DAYS:-30}d" "$DEST"

echo "backup ok: ${DEST}/$(basename "$FILE")"
