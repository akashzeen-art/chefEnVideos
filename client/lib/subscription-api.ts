import {
  PRODUCT_CODE,
  SubscriptionDetailResponse,
  SubscriptionStatusResponse,
  formatMsisdnForApi,
  getCampaignUrl,
  normalizeSubid,
} from "@shared/subscription";

interface ApiOptions {
  subid: string;
  productcode?: string;
  msisdn?: string;
}

function buildParams({ subid, productcode = PRODUCT_CODE, msisdn }: ApiOptions): URLSearchParams {
  const params = new URLSearchParams({
    subid: normalizeSubid(subid),
    productcode,
  });
  if (msisdn) params.set("msisdn", formatMsisdnForApi(msisdn));
  return params;
}

async function apiGet<T>(path: string, options: ApiOptions): Promise<T> {
  const response = await fetch(`${path}?${buildParams(options).toString()}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function checkSubscriptionStatus(
  subid: string,
  productcode: string = PRODUCT_CODE,
  msisdn?: string,
): Promise<SubscriptionStatusResponse> {
  return apiGet<SubscriptionStatusResponse>("/api/subscription/status", {
    subid,
    productcode,
    msisdn,
  });
}

export async function getSubscriptionDetail(
  subid: string,
  productcode: string = PRODUCT_CODE,
  msisdn?: string,
): Promise<SubscriptionDetailResponse> {
  return apiGet<SubscriptionDetailResponse>("/api/subscription/detail", {
    subid,
    productcode,
    msisdn,
  });
}

export async function deactivateSubscription(
  subid: string,
  productcode: string = PRODUCT_CODE,
  msisdn?: string,
): Promise<unknown> {
  return apiGet<unknown>("/api/subscription/deactivate", { subid, productcode, msisdn });
}

export function redirectToCampaign(
  subid: string,
  productcode: string = PRODUCT_CODE,
): void {
  window.location.href = getCampaignUrl(normalizeSubid(subid), productcode);
}
