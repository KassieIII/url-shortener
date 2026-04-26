import Redis from "ioredis";
import { config } from "../config";
import { logger } from "./logger";

let client: Redis | null = null;

export async function connectRedis(): Promise<Redis> {
  if (client) return client;
  client = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
  client.on("error", (e) => logger.error("redis error", e));
  await client.connect();
  logger.info("connected to redis");
  return client;
}

export function getRedis(): Redis {
  if (!client) throw new Error("Redis not initialised. Call connectRedis() first.");
  return client;
}

export async function closeRedis() {
  if (client) {
    await client.quit();
    client = null;
  }
}
