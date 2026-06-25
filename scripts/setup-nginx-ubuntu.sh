#!/usr/bin/env bash
# Configure nginx for THIS project only (mrecettedelicieuse.com → port 3015).
# Does NOT modify other nginx sites or other PM2 apps on the server.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="mrecettedelicieuse.com"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"

echo "==> This script only updates: ${NGINX_SITE}"
echo "==> Other websites and ports on this server are NOT changed."
echo ""

if [ ! -f "${CERT_DIR}/fullchain.pem" ] || [ ! -f "${CERT_DIR}/privkey.pem" ]; then
  echo "WARN: SSL cert not found at ${CERT_DIR}"
  echo "      Installing HTTP-only config first..."
  sed '/^# HTTPS/,/^}$/d' "$APP_DIR/deploy/nginx-mrecettedelicieuse.conf" > /tmp/nginx-${DOMAIN}.conf
  cp /tmp/nginx-${DOMAIN}.conf "$NGINX_SITE"
  echo ""
  echo "==> After DNS works, get cert (this domain only):"
  echo "  sudo certbot certonly --nginx -d mrecettedelicieuse.com -d www.mrecettedelicieuse.com"
  echo "  sudo bash scripts/setup-nginx-ubuntu.sh"
else
  cp "$APP_DIR/deploy/nginx-mrecettedelicieuse.conf" "$NGINX_SITE"
  echo "OK: Using SSL cert from ${CERT_DIR}"
fi

ln -sf "$NGINX_SITE" "$NGINX_ENABLED"

echo "==> Testing nginx..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo ""
echo "==> Test HTTP:"
curl -s -H "Host: ${DOMAIN}" "http://127.0.0.1/api/ping" || true
echo ""

echo "==> Test HTTPS:"
curl -sk -H "Host: ${DOMAIN}" "https://127.0.0.1/api/ping" || true
echo ""

TITLE_HTTP=$(curl -s -H "Host: ${DOMAIN}" "http://127.0.0.1/" | grep -o '<title>[^<]*</title>' | head -1 || true)
TITLE_HTTPS=$(curl -sk -H "Host: ${DOMAIN}" "https://127.0.0.1/" | grep -o '<title>[^<]*</title>' | head -1 || true)
echo "==> Page title HTTP:  ${TITLE_HTTP:-unknown}"
echo "==> Page title HTTPS: ${TITLE_HTTPS:-unknown}"
echo ""
echo "Expected title: <title>Chef En Videos</title>"
echo ""
echo "==> Do NOT run interactive certbot if cert already exists."
echo "    This config uses the existing cert and proxies to port 3015 only."
