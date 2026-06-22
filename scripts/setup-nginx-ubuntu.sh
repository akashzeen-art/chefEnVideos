#!/usr/bin/env bash
# Configure nginx on Ubuntu so chefenvideos.com → port 3015
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NGINX_SITE="/etc/nginx/sites-available/chefenvideos.com"
NGINX_ENABLED="/etc/nginx/sites-enabled/chefenvideos.com"

echo "==> Installing nginx site config..."
cp "$APP_DIR/deploy/nginx-chefenvideos.conf" "$NGINX_SITE"
ln -sf "$NGINX_SITE" "$NGINX_ENABLED"

echo "==> Testing nginx..."
nginx -t

echo "==> Reloading nginx..."
systemctl reload nginx

echo ""
echo "==> Test HTTP (from server):"
curl -s -H "Host: chefenvideos.com" "http://127.0.0.1/api/ping" || true
echo ""
curl -s -H "Host: chefenvideos.com" "http://127.0.0.1/api/subscription/status?subid=0&msisdn=2250505763455&productcode=NIRV" || true
echo ""

echo ""
echo "==> Optional: enable HTTPS"
echo "  certbot --nginx -d chefenvideos.com -d www.chefenvideos.com"
echo ""
echo "==> IMPORTANT: Remove chefenvideos.com from Vercel dashboard"
echo "  (Domains → delete) so DNS only points to this server: 160.187.80.197"
