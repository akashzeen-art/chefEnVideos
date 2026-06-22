import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const ping = process.env.PING_MESSAGE ?? "ping";
  return res.status(200).json({ message: ping });
}
