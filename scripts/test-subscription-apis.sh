#!/usr/bin/env bash
# NIRV subscription API test script
# Usage: ./scripts/test-subscription-apis.sh [BASE_URL]
# Default BASE_URL: http://localhost:8080

set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
PRODUCT_CODE="NIRV"
ACTIVE_SUB_ID="252221710"
INACTIVE_SUB_ID="253393155"

pass=0
fail=0

check_json() {
  local name="$1"
  local url="$2"
  local expect="$3"

  echo ""
  echo "── $name"
  echo "   GET $url"
  body=$(curl -s --max-time 20 "$url" || echo '{"error":"curl failed"}')
  echo "   Response: $body"

  if echo "$body" | grep -q "$expect"; then
    echo "   ✅ PASS (contains: $expect)"
    pass=$((pass + 1))
  else
    echo "   ❌ FAIL (expected to contain: $expect)"
    fail=$((fail + 1))
  fi
}

check_http() {
  local name="$1"
  local url="$2"
  local expect_code="$3"

  echo ""
  echo "── $name"
  echo "   GET $url"
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$url" || echo "000")
  echo "   HTTP: $code"

  if [ "$code" = "$expect_code" ]; then
    echo "   ✅ PASS"
    pass=$((pass + 1))
  else
    echo "   ❌ FAIL (expected HTTP $expect_code)"
    fail=$((fail + 1))
  fi
}

echo "========================================"
echo " NIRV Subscription API Tests"
echo " Base URL: $BASE_URL"
echo " Product:  $PRODUCT_CODE"
echo " Active:   $ACTIVE_SUB_ID"
echo " Inactive: $INACTIVE_SUB_ID"
echo "========================================"

# Server health
check_json "Ping" "$BASE_URL/api/ping" "message"
check_http "Proxy reachable" "$BASE_URL/api/subscription/status?subid=0&productcode=$PRODUCT_CODE" "200"

# Status API via proxy
check_json "Status — active sub" \
  "$BASE_URL/api/subscription/status?subid=$ACTIVE_SUB_ID&productcode=$PRODUCT_CODE" \
  '"status"'

check_json "Status — inactive sub" \
  "$BASE_URL/api/subscription/status?subid=$INACTIVE_SUB_ID&productcode=$PRODUCT_CODE" \
  '"status"'

# Detail API via proxy
check_json "Detail — active sub" \
  "$BASE_URL/api/subscription/detail?subid=$ACTIVE_SUB_ID&productcode=$PRODUCT_CODE" \
  '"status"'

check_json "Detail — inactive sub" \
  "$BASE_URL/api/subscription/detail?subid=$INACTIVE_SUB_ID&productcode=$PRODUCT_CODE" \
  '"status"'

# Campaign redirect (302/301 to external)
echo ""
echo "── Campaign redirect"
campaign_url="$BASE_URL/api/subscription/campaign?subid=$INACTIVE_SUB_ID&productcode=$PRODUCT_CODE"
echo "   GET $campaign_url"
redirect=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 20 "$campaign_url" || echo "000")
echo "   Result: $redirect"
if echo "$redirect" | grep -qE "30[1278]"; then
  echo "   ✅ PASS (redirect)"
  pass=$((pass + 1))
else
  echo "   ❌ FAIL (expected redirect 301/302/307/308)"
  fail=$((fail + 1))
fi

echo ""
echo "========================================"
echo " Results: $pass passed, $fail failed"
echo "========================================"

if [ "$fail" -gt 0 ]; then
  exit 1
fi
