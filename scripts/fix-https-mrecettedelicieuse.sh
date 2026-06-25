#!/usr/bin/env bash
# Fix HTTPS showing wrong website (AiGameopedia etc.) for mrecettedelicieuse.com.
# ONLY touches /etc/nginx/sites-available/mrecettedelicieuse.com — nothing else.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="mrecettedelicieuse.com"
PORT=3015

echo "==> Fixing HTTPS for ${DOMAIN} only (proxy → 127.0.0.1:${PORT})"
echo "==> Will NOT change other nginx sites or PM2 apps."
echo ""

# Verify this app's backend is up
if ! curl -sf "http://127.0.0.1:${PORT}/api/ping" >/dev/null; then
  echo "ERROR: Nothing on port ${PORT}. Run: bash scripts/deploy-ubuntu.sh"
  exit 1
fi
echo "OK: Port ${PORT} responds: $(curl -s "http://127.0.0.1:${PORT}/api/ping")"

if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  echo "ERROR: SSL cert missing. Run:"
  echo "  sudo certbot certonly --webroot -w /var/www/html -d ${DOMAIN} -d www.${DOMAIN}"
  echo "  OR: sudo certbot certonly --nginx -d ${DOMAIN} -d www.${DOMAIN}"
  exit 1
fi

sudo bash "$APP_DIR/scripts/setup-nginx-ubuntu.sh"

echo ""
echo "==> External check (from server):"
curl -sk "https://${DOMAIN}/api/ping" || true
echo ""
curl -sk "https://${DOMAIN}/" | grep -o '<title>[^<]*</title>' | head -1 || true
