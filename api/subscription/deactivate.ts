import type { VercelRequest, VercelResponse } from "@vercel/node";
import { API_ENDPOINTS } from "../../shared/subscription";
import { buildOperatorParams, getSubscriptionQuery } from "../_lib/params";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { subid, productcode, msisdn } = getSubscriptionQuery(req.query);

  try {
    const params = buildOperatorParams(subid, productcode, msisdn);
    const response = await fetch(`${API_ENDPOINTS.deactivate}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const text = await response.text();

    let data: unknown = { success: response.ok };
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: response.ok, message: text };
    }

    return res.status(response.ok ? 200 : 502).json(data);
  } catch (error) {
    console.error("subscription/deactivate:", error);
    return res.status(502).json({ error: "Failed to deactivate subscription" });
  }
}
