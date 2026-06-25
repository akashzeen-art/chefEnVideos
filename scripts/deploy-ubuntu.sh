#!/usr/bin/env bash
# Deploy THIS project only (Chef N Videos CIV MTN / mrecettedelicieuse.com).
# Only touches files in this folder and PM2 app "chefenvideos" on port 3015.
# Usage on server: bash scripts/deploy-ubuntu.sh

set -euo pipefail

export CI=true
export PNPM_SKIP_PROMPT=1

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

echo "==> Deploying from: $APP_DIR"

# Node.js 20+ required
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js not installed. Install Node 20+ first."
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "ERROR: Node.js 20+ required (found $(node -v))"
  exit 1
fi

echo "==> Resetting local build output (dist is rebuilt on deploy)..."
git checkout -- dist/ 2>/dev/null || true
git clean -fd dist/ 2>/dev/null || true
rm -rf dist

echo "==> Pulling latest code..."
git pull origin main

echo "==> Installing dependencies..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --no-frozen-lockfile
else
  npm install
fi

echo "==> Building client + server..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm build
else
  npm run build
fi

echo "==> Restarting app with PM2..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 startOrRestart ecosystem.config.cjs --update-env
  pm2 save
  echo "==> PM2 status:"
  pm2 status chefenvideos
else
  echo "WARN: PM2 not installed. Start manually:"
  echo "  PORT=3000 node dist/server/node-build.mjs"
fi

echo ""
echo "==> Deploy complete. Test locally on server:"
echo "  curl -s http://127.0.0.1:3015/api/ping"
echo "  curl -s \"http://127.0.0.1:3015/api/subscription/status?subid=0&msisdn=2250505763455&productcode=NIRV\""
echo ""
echo "==> After DNS points to this server, fix nginx (this domain only):"
echo "  sudo bash scripts/fix-https-mrecettedelicieuse.sh"
