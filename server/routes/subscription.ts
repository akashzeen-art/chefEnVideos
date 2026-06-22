import { RequestHandler } from "express";
import {
  API_ENDPOINTS,
  PRODUCT_CODE,
  SubscriptionDetailResponse,
  SubscriptionStatusResponse,
  formatMsisdnForApi,
  normalizeSubid,
} from "../../shared/subscription";

async function fetchExternal<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`External API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function getParams(req: { query: Record<string, unknown> }) {
  const subid = normalizeSubid(String(req.query.subid ?? "0"));
  const productcode = String(req.query.productcode ?? PRODUCT_CODE);
  const rawMsisdn = String(req.query.msisdn ?? "").trim();
  const msisdn = rawMsisdn ? formatMsisdnForApi(rawMsisdn) : "";
  return { subid, productcode, msisdn };
}

function buildExternalUrl(
  endpoint: string,
  subid: string,
  productcode: string,
  msisdn?: string,
): string {
  const params = new URLSearchParams({ subid, productcode });
  if (msisdn) params.set("msisdn", msisdn);
  return `${endpoint}?${params.toString()}`;
}

export const handleSubscriptionStatus: RequestHandler = async (req, res) => {
  try {
    const { subid, productcode, msisdn } = getParams(req);
    const url = buildExternalUrl(API_ENDPOINTS.status, subid, productcode, msisdn);
    const data = await fetchExternal<SubscriptionStatusResponse>(url);
    res.json(data);
  } catch (error) {
    console.error("Subscription status error:", error);
    res.status(502).json({ status: 0, error: "Failed to check subscription status" });
  }
};

export const handleSubscriptionDetail: RequestHandler = async (req, res) => {
  try {
    const { subid, productcode, msisdn } = getParams(req);
    const url = buildExternalUrl(API_ENDPOINTS.detail, subid, productcode, msisdn);
    const data = await fetchExternal<SubscriptionDetailResponse>(url);
    res.json(data);
  } catch (error) {
    console.error("Subscription detail error:", error);
    res.status(502).json({ error: "Failed to fetch subscription details" });
  }
};

export const handleSubscriptionDeactivate: RequestHandler = async (req, res) => {
  try {
    const { subid, productcode, msisdn } = getParams(req);
    const url = buildExternalUrl(API_ENDPOINTS.deactivate, subid, productcode, msisdn);
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    const text = await response.text();

    let data: unknown = { success: response.ok };
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

export const handleCampaignRedirect: RequestHandler = (req, res) => {
  const { subid, productcode } = getParams(req);
  const params = new URLSearchParams({ subid, productcode });
  const url = `${API_ENDPOINTS.campaign}?${params.toString()}`;
  res.redirect(url);
};
