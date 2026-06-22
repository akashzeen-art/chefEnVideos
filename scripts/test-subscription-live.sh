#!/usr/bin/env bash
# Strict NIRV live API validation (external + local proxy)
# Usage: ./scripts/test-subscription-live.sh [BASE_URL]

set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
PRODUCT_CODE="NIRV"
ACTIVE_SUB_ID="252221710"
INACTIVE_SUB_ID="253393155"
EXTERNAL="http://68.183.88.91/adpoke/cnt"

fetch_status() {
  local base="$1"
  local subid="$2"
  curl -s --max-time 20 "${base}/sub/status?subid=${subid}&productcode=${PRODUCT_CODE}" \
    || echo '{"error":"request failed"}'
}

proxy_status() {
  curl -s --max-time 20 "${BASE_URL}/api/subscription/status?subid=$1&productcode=${PRODUCT_CODE}" \
    || echo '{"error":"request failed"}'
}

json_status() {
  node -e "const d=JSON.parse(process.argv[1]); console.log(d.status ?? 'null')" "$1" 2>/dev/null || echo "parse_error"
}

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  NIRV Live Subscription Test Report                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Product code : $PRODUCT_CODE"
echo "Active subid : $ACTIVE_SUB_ID"
echo "Inactive sub : $INACTIVE_SUB_ID"
echo "Proxy base   : $BASE_URL"
echo ""

echo "┌─ External API (68.183.88.91) ─────────────────────────────────"
ext_active=$(fetch_status "$EXTERNAL" "$ACTIVE_SUB_ID")
ext_inactive=$(fetch_status "$EXTERNAL" "$INACTIVE_SUB_ID")
echo "│ Active   ($ACTIVE_SUB_ID): $ext_active"
echo "│ Inactive ($INACTIVE_SUB_ID): $ext_inactive"
echo "└──────────────────────────────────────────────────────────────"
echo ""

echo "┌─ Local proxy ($BASE_URL) ─────────────────────────────────────"
px_active=$(proxy_status "$ACTIVE_SUB_ID")
px_inactive=$(proxy_status "$INACTIVE_SUB_ID")
echo "│ Active   ($ACTIVE_SUB_ID): $px_active"
echo "│ Inactive ($INACTIVE_SUB_ID): $px_inactive"
echo "└──────────────────────────────────────────────────────────────"
echo ""

ext_active_s=$(json_status "$ext_active")
ext_inactive_s=$(json_status "$ext_inactive")
px_active_s=$(json_status "$px_active")
px_inactive_s=$(json_status "$px_inactive")

echo "┌─ Validation ──────────────────────────────────────────────────"

ok=0
warn=0

if [ "$px_active" = "$ext_active" ] && [ "$px_inactive" = "$ext_inactive" ]; then
  echo "│ ✅ Proxy matches external API responses"
  ok=$((ok + 1))
else
  echo "│ ❌ Proxy mismatch vs external API"
  warn=$((warn + 1))
fi

if [ "$ext_active_s" = "1" ]; then
  echo "│ ✅ Active subid returns status=1 (subscribed)"
  ok=$((ok + 1))
else
  echo "│ ⚠️  Active subid returned status=$ext_active_s (expected 1)"
  warn=$((warn + 1))
fi

if [ "$ext_inactive_s" = "0" ]; then
  echo "│ ✅ Inactive subid returns status=0 (not subscribed)"
  ok=$((ok + 1))
else
  echo "│ ⚠️  Inactive subid returned status=$ext_inactive_s (expected 0)"
  warn=$((warn + 1))
fi

if [ "$ext_active_s" != "$ext_inactive_s" ]; then
  echo "│ ✅ Active and inactive subids differ (as expected)"
  ok=$((ok + 1))
else
  echo "│ ⚠️  Active and inactive subids return same status ($ext_active_s)"
  warn=$((warn + 1))
fi

echo "└──────────────────────────────────────────────────────────────"
echo ""
echo "Summary: $ok checks passed, $warn warnings"
echo ""
echo "Browser test URLs:"
echo "  Active portal  : ${BASE_URL}/?subid=${ACTIVE_SUB_ID}&productcode=${PRODUCT_CODE}"
echo "  Inactive portal: ${BASE_URL}/?subid=${INACTIVE_SUB_ID}&productcode=${PRODUCT_CODE}"
echo "  Content page   : ${BASE_URL}/content/url?subid=${ACTIVE_SUB_ID}&productcode=${PRODUCT_CODE}"
echo ""
