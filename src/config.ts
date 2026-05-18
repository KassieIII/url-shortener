import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  BASE_URL: z.string().url().default("http://localhost:3000"),
  RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(60),
  CODE_LENGTH: z.coerce.number().int().min(4).max(16).default(7),
});

const rawEnv = { ...process.env };
for (const key of Object.keys(rawEnv)) {
  if (rawEnv[key] === "") delete rawEnv[key];
}

const env = envSchema.parse(rawEnv);

export const config = {
  port: env.PORT,
  redisUrl: env.REDIS_URL,
  baseUrl: env.BASE_URL.replace(/\/$/, ""),
  rateLimitPerMinute: env.RATE_LIMIT_PER_MINUTE,
  codeLength: env.CODE_LENGTH,
};
