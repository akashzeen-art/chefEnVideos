import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleCampaignRedirect,
  handleSubscriptionDeactivate,
  handleSubscriptionDetail,
  handleSubscriptionStatus,
} from "./routes/subscription";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Subscription proxy routes (NIRV / CIV MTN)
  app.get("/api/subscription/status", handleSubscriptionStatus);
  app.get("/api/subscription/detail", handleSubscriptionDetail);
  app.get("/api/subscription/deactivate", handleSubscriptionDeactivate);
  app.get("/api/subscription/campaign", handleCampaignRedirect);

  return app;
}
