type Level = "info" | "warn" | "error" | "debug";

function fmt(level: Level, msg: string, meta?: unknown) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...(meta ? { meta } : {}),
  };
  return JSON.stringify(entry);
}

export const logger = {
  info: (msg: string, meta?: unknown) => console.log(fmt("info", msg, meta)),
  warn: (msg: string, meta?: unknown) => console.warn(fmt("warn", msg, meta)),
  error: (msg: string, meta?: unknown) => console.error(fmt("error", msg, meta)),
  debug: (msg: string, meta?: unknown) => {
    if (process.env.DEBUG) console.debug(fmt("debug", msg, meta));
  },
};
