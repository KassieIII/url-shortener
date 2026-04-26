import { createApp } from "./app";
import { connectRedis } from "./lib/redis";
import { config } from "./config";
import { logger } from "./lib/logger";

async function main() {
  await connectRedis();
  const app = createApp();

  app.listen(config.port, () => {
    logger.info(`url-shortener listening on :${config.port}`);
  });
}

main().catch((err) => {
  logger.error("Fatal error during startup", err);
  process.exit(1);
});
