import { PRODUCT_CODE, normalizeSubid, formatMsisdnForApi } from "../../shared/subscription";

export function getSubscriptionQuery(query: Record<string, string | string[] | undefined>) {
  const subid = normalizeSubid(String(query.subid ?? "0"));
  const productcode = String(query.productcode ?? PRODUCT_CODE);
  const rawMsisdn = String(query.msisdn ?? "").trim();
  const msisdn = rawMsisdn ? formatMsisdnForApi(rawMsisdn) : "";
  return { subid, productcode, msisdn };
}

export function buildOperatorParams(subid: string, productcode: string, msisdn?: string) {
  const params = new URLSearchParams({ subid, productcode });
  if (msisdn) params.set("msisdn", msisdn);
  return params;
}
