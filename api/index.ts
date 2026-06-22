import { createServer } from "../server/index";

/** Vercel serverless entry — proxies /api/* to Express (subscription, ping, etc.) */
const app = createServer();

export default app;
