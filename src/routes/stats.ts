import { Router } from "express";
import { getRedis } from "../lib/redis";
import { isValidCode } from "../lib/codes";

export const statsRouter = Router();

statsRouter.get("/:code", async (req, res) => {
  const code = req.params.code;
  if (!isValidCode(code)) return res.status(400).json({ error: "invalid_code" });

  const redis = getRedis();
  const [raw, clicks] = await Promise.all([
    redis.get(`url:${code}`),
    redis.get(`stats:${code}`),
  ]);

  if (!raw) return res.status(404).json({ error: "not_found" });

  const data = JSON.parse(raw);
  res.json({
    code,
    url: data.url,
    createdAt: data.createdAt,
    clicks: Number(clicks ?? 0),
  });
});
