import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

async function createTestApp() {
  vi.resetModules();
  process.env.BASE_URL = "http://localhost:3000";
  const { createApp } = await import("../src/app");
  return createApp();
}

describe("health endpoints", () => {
  beforeEach(() => {
    delete process.env.BASE_URL;
  });

  it("returns liveness from /health and /healthz", async () => {
    const app = await createTestApp();

    await request(app).get("/health").expect(200, { status: "ok" });
    await request(app).get("/healthz").expect(200, { status: "ok" });
  });

  it("reports not ready when Redis has not been initialised", async () => {
    const app = await createTestApp();

    const response = await request(app).get("/readyz").expect(503);
    expect(response.body).toEqual({
      status: "not_ready",
      redis: "unavailable",
    });
  });
});