import { Router } from "express";
import { z } from "zod";

import { getRedis } from "../lib/redis";
import { generateCode } from "../lib/codes";
import { config } from "../config";

export const shortenRouter = Router();

const bodySchema = z.object({
  url: z.string().url().max(2048),
  ttlSeconds: z.number().int().min(60).max(60 * 60 * 24 * 365).optional(),
});

const RESERVED = new Set(["api", "health", "admin", "robots.txt", "favicon.ico"]);

shortenRouter.post("/", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "invalid_body",
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  const redis = getRedis();
  let code = "";
  for (let i = 0; i < 5; i++) {
    code = generateCode();
    if (RESERVED.has(code)) continue;
    const exists = await redis.exists(`url:${code}`);
    if (!exists) break;
  }

  const key = `url:${code}`;
  const data = JSON.stringify({
    url: parsed.data.url,
    createdAt: new Date().toISOString(),
  });

  if (parsed.data.ttlSeconds) {
    await redis.set(key, data, "EX", parsed.data.ttlSeconds);
  } else {
    await redis.set(key, data);
  }

  res.status(201).json({
    code,
    shortUrl: `${config.baseUrl}/${code}`,
    url: parsed.data.url,
  });
});
