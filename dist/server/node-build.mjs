import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const PRODUCT_CODE = "NIRV";
const API_BASE = "http://68.183.88.91/adpoke/cnt";
const API_ENDPOINTS = {
  status: `${API_BASE}/sub/status`,
  detail: `${API_BASE}/sub/detail`,
  campaign: `${API_BASE}/act`,
  deactivate: `${API_BASE}/dct`
};
function formatMsisdnForApi(msisdn) {
  const digits = msisdn.replace(/\D/g, "");
  if (digits.startsWith("225")) return digits;
  return `225${digits}`;
}
function normalizeSubid(subid) {
  const value = subid?.trim();
  return value ? value : "0";
}
async function fetchExternal(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(`External API error: ${response.status}`);
  }
  return response.json();
}
function getParams(req) {
  const subid = normalizeSubid(String(req.query.subid ?? "0"));
  const productcode = String(req.query.productcode ?? PRODUCT_CODE);
  const rawMsisdn = String(req.query.msisdn ?? "").trim();
  const msisdn = rawMsisdn ? formatMsisdnForApi(rawMsisdn) : "";
  return { subid, productcode, msisdn };
}
function buildExternalUrl(endpoint, subid, productcode, msisdn) {
  const params = new URLSearchParams({ subid, productcode });
  if (msisdn) params.set("msisdn", msisdn);
  return `${endpoint}?${params.toString()}`;
}
const handleSubscriptionStatus = async (req, res) => {
  try {
    const { subid, productcode, msisdn } = getParams(req);
    const url = buildExternalUrl(API_ENDPOINTS.status, subid, productcode, msisdn);
    const data = await fetchExternal(url);
    res.json(data);
  } catch (error) {
    console.error("Subscription status error:", error);
    res.status(502).json({ status: 0, error: "Failed to check subscription status" });
  }
};
const handleSubscriptionDetail = async (req, res) => {
  try {
    const { subid, productcode, msisdn } = getParams(req);
    const url = buildExternalUrl(API_ENDPOINTS.detail, subid, productcode, msisdn);
    const data = await fetchExternal(url);
    res.json(data);
  } catch (error) {
    console.error("Subscription detail error:", error);
    res.status(502).json({ error: "Failed to fetch subscription details" });
  }
};
const handleSubscriptionDeactivate = async (req, res) => {
  try {
    const { subid, productcode, msisdn } = getParams(req);
    const url = buildExternalUrl(API_ENDPOINTS.deactivate, subid, productcode, msisdn);
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const text = await response.text();
    let data = { success: response.ok };
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: response.ok, message: text };
    }
    res.status(response.ok ? 200 : 502).json(data);
  } catch (error) {
    console.error("Subscription deactivate error:", error);
    res.status(502).json({ error: "Failed to deactivate subscription" });
  }
};
const handleCampaignRedirect = (req, res) => {
  const { subid, productcode } = getParams(req);
  const params = new URLSearchParams({ subid, productcode });
  const url = `${API_ENDPOINTS.campaign}?${params.toString()}`;
  res.redirect(url);
};
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.get("/api/subscription/status", handleSubscriptionStatus);
  app2.get("/api/subscription/detail", handleSubscriptionDetail);
  app2.get("/api/subscription/deactivate", handleSubscriptionDeactivate);
  app2.get("/api/subscription/campaign", handleCampaignRedirect);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return next();
  }
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next(err);
  });
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
