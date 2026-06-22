import type { VercelRequest, VercelResponse } from "@vercel/node";
import { API_ENDPOINTS } from "../../shared/subscription";
import { buildOperatorParams, getSubscriptionQuery } from "../_lib/params";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { subid, productcode, msisdn } = getSubscriptionQuery(req.query);

  try {
    const params = buildOperatorParams(subid, productcode, msisdn);
    const response = await fetch(`${API_ENDPOINTS.status}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return res.status(502).json({ status: 0, error: "External API error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("subscription/status:", error);
    return res.status(502).json({ status: 0, error: "Failed to check subscription status" });
  }
}
