import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { config } from "./config";
import { shortenRouter } from "./routes/shorten";
import { redirectRouter } from "./routes/redirect";
import { statsRouter } from "./routes/stats";
import { logger } from "./lib/logger";
import { getRedis } from "./lib/redis";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "10kb" }));

  const limiter = rateLimit({
    windowMs: 60_000,
    max: config.rateLimitPerMinute,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", limiter);

  app.get(["/health", "/healthz"], (_req, res) => res.json({ status: "ok" }));
  app.get("/readyz", async (_req, res) => {
    try {
      await getRedis().ping();
      res.json({ status: "ready", redis: "ok" });
    } catch {
      res.status(503).json({ status: "not_ready", redis: "unavailable" });
    }
  });

  app.use("/api/shorten", shortenRouter);
  app.use("/api/stats", statsRouter);
  app.use("/", redirectRouter);

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", err);
    res.status(500).json({ error: "internal_error" });
  });

  return app;
}
