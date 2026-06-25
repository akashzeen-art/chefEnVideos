#!/usr/bin/env bash
# Configure nginx for THIS project only (mrecettedelicieuse.com → port 3015).
# Does NOT modify other nginx sites or other PM2 apps on the server.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="mrecettedelicieuse.com"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

echo "==> This script only adds/updates: ${NGINX_SITE}"
echo "==> Other websites on this server are not changed."
echo ""

cp "$APP_DIR/deploy/nginx-mrecettedelicieuse.conf" "$NGINX_SITE"
ln -sf "$NGINX_SITE" "$NGINX_ENABLED"

echo "==> Testing nginx..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo ""
echo "==> Test HTTP for ${DOMAIN} only:"
curl -s -H "Host: ${DOMAIN}" "http://127.0.0.1/api/ping" || true
echo ""
curl -s -H "Host: ${DOMAIN}" "http://127.0.0.1/api/subscription/status?subid=0&msisdn=2250505763455&productcode=NIRV" || true
echo ""

echo ""
echo "==> HTTPS for this domain only:"
echo "  sudo certbot --nginx -d mrecettedelicieuse.com -d www.mrecettedelicieuse.com"
echo ""
echo "==> If this app used chefenvideos.com before, disable that vhost manually (optional):"
echo "  sudo rm -f /etc/nginx/sites-enabled/chefenvideos.com && sudo nginx -t && sudo systemctl reload nginx"
