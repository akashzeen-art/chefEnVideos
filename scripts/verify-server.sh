#!/usr/bin/env bash
# Verify production server build has subscription routes
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BUILD="$APP_DIR/dist/server/node-build.mjs"

echo "==> Project: $APP_DIR"
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

if /usr/bin/curl -sf "http://127.0.0.1:3000/api/ping" >/dev/null 2>&1; then
  echo ""
  echo "==> /api/ping"
  /usr/bin/curl -s "http://127.0.0.1:3000/api/ping"
  echo ""
  echo "==> /api/subscription/status"
  /usr/bin/curl -s "http://127.0.0.1:3000/api/subscription/status?subid=0&msisdn=2250505763455&productcode=NIRV"
  echo ""
else
  echo "WARN: Nothing listening on port 3000. Run: pm2 restart chefenvideos"
fi
