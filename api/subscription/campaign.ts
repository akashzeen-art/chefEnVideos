import type { VercelRequest, VercelResponse } from "@vercel/node";
import { API_ENDPOINTS } from "../../shared/subscription";
import { buildOperatorParams, getSubscriptionQuery } from "../_lib/params";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { subid, productcode } = getSubscriptionQuery(req.query);
  const params = buildOperatorParams(subid, productcode);
  const url = `${API_ENDPOINTS.campaign}?${params.toString()}`;
  return res.redirect(302, url);
}
