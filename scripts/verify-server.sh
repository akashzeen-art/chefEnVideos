#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$APP_DIR/dist/server/node-build.mjs"
PORT="${PORT:-3015}"

echo "==> Project: $APP_DIR"
echo "==> Port: $PORT"
echo "==> Git: $(git -C "$APP_DIR" log -1 --oneline 2>/dev/null || echo 'not a git repo')"

if [ ! -f "$BUILD" ]; then
  echo "ERROR: Missing $BUILD — run: pnpm build"
  exit 1
fi

if ! grep -q 'api/subscription/status' "$BUILD"; then
  echo "ERROR: Build is OLD (no subscription routes). Run: pnpm build"
  exit 1
fi

echo "OK: subscription routes found in build"

echo ""
echo "==> Who is using port $PORT?"
ss -tlnp | grep ":$PORT " || echo "(nothing on $PORT yet)"

echo ""
echo "==> PM2 chefenvideos (this app only)"
pm2 describe chefenvideos 2>/dev/null | grep -E "status|script path|exec cwd|PORT" || echo "chefenvideos not in pm2"

if /usr/bin/curl -sf "http://127.0.0.1:${PORT}/api/ping" >/dev/null 2>&1; then
  echo ""
  echo "==> /api/ping"
  /usr/bin/curl -s "http://127.0.0.1:${PORT}/api/ping"
  echo ""
  echo "==> /api/subscription/status"
  /usr/bin/curl -s "http://127.0.0.1:${PORT}/api/subscription/status?subid=0&msisdn=2250505763455&productcode=NIRV"
  echo ""
else
  echo ""
  echo "WARN: Nothing on port $PORT. Run: pm2 startOrRestart ecosystem.config.cjs"
fi
