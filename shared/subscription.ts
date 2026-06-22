/** NIRV product subscription configuration for CIV MTN */
export const PRODUCT_CODE = "NIRV";

/** Test subscriber IDs (for QA) */
export const ACTIVE_SUB_ID = "252221710";
export const INACTIVE_SUB_ID = "253393155";

export const COUNTRY_CODE = "+225";

export const API_BASE = "http://68.183.88.91/adpoke/cnt";

export const API_ENDPOINTS = {
  status: `${API_BASE}/sub/status`,
  detail: `${API_BASE}/sub/detail`,
  campaign: `${API_BASE}/act`,
  deactivate: `${API_BASE}/dct`,
} as const;

export const STORAGE_KEYS = {
  subid: "nirv_subid",
  productcode: "nirv_productcode",
  msisdn: "nirv_msisdn",
} as const;

/** Portal entry path: http://portal.com/content/url?subid={subid}&productcode={productcode} */
export const PORTAL_CONTENT_PATH = "/content/url";

export interface SubscriptionStatusResponse {
  status: "0" | "1" | 0 | 1;
  msisdn?: string | null;
  validityfrom?: string;
  validityto?: string;
}

export interface SubscriptionDetailResponse {
  msisdn: string;
  valid_from: string;
  valid_to: string;
  status: "0" | "1" | 0 | 1;
  service_name: string;
}

export function formatMsisdnForApi(msisdn: string): string {
  const digits = msisdn.replace(/\D/g, "");
  if (digits.startsWith("225")) return digits;
  return `225${digits}`;
}

export function buildApiUrl(
  endpoint: keyof typeof API_ENDPOINTS,
  subid: string,
  productcode: string = PRODUCT_CODE,
  msisdn?: string,
): string {
  const params = new URLSearchParams({
    subid: normalizeSubid(subid),
    productcode,
  });
  if (msisdn && endpoint !== "campaign") {
    params.set("msisdn", formatMsisdnForApi(msisdn));
  }
  return `${API_ENDPOINTS[endpoint]}?${params.toString()}`;
}

/** Campaign: /act?subid={subid}&productcode={productcode} — subid=0 if not exists */
export function getCampaignUrl(
  subid: string,
  productcode: string = PRODUCT_CODE,
): string {
  const params = new URLSearchParams({
    subid: normalizeSubid(subid),
    productcode,
  });
  return `${API_ENDPOINTS.campaign}?${params.toString()}`;
}

export function normalizeSubid(subid: string | null | undefined): string {
  const value = subid?.trim();
  return value ? value : "0";
}

export function isSubscribed(
  status: SubscriptionStatusResponse | SubscriptionDetailResponse | null | undefined,
): boolean {
  if (!status) return false;
  const value = "status" in status ? status.status : 0;
  return String(value) === "1";
}
