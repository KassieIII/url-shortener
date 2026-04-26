import { Router } from "express";
import { getRedis } from "../lib/redis";
import { isValidCode } from "../lib/codes";

export const redirectRouter = Router();

redirectRouter.get("/:code", async (req, res) => {
  const code = req.params.code;
  if (!isValidCode(code)) return res.status(404).send("Not found");

  const redis = getRedis();
  const raw = await redis.get(`url:${code}`);
  if (!raw) return res.status(404).send("Not found");

  let parsed: { url: string };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return res.status(500).send("Corrupted entry");
  }

  // fire-and-forget click counter
  redis.incr(`stats:${code}`).catch(() => undefined);

  res.redirect(302, parsed.url);
});
