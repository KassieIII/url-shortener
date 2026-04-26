import { describe, it, expect } from "vitest";
import { isValidCode } from "../src/lib/codes";

describe("isValidCode", () => {
  it("accepts lowercase alphanumeric of length 4-16", () => {
    expect(isValidCode("abcd1")).toBe(true);
    expect(isValidCode("xyz2k7m")).toBe(true);
  });

  it("rejects too short", () => {
    expect(isValidCode("ab")).toBe(false);
  });

  it("rejects too long", () => {
    expect(isValidCode("a".repeat(17))).toBe(false);
  });

  it("rejects uppercase and special chars", () => {
    expect(isValidCode("ABCDE")).toBe(false);
    expect(isValidCode("ab-cd")).toBe(false);
    expect(isValidCode("ab.cd")).toBe(false);
  });
});
