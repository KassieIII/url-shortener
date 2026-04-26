import { customAlphabet } from "nanoid";
import { config } from "../config";

const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

const generator = customAlphabet(ALPHABET, config.codeLength);

export function generateCode(): string {
  return generator();
}

const CODE_RE = /^[a-z0-9]{4,16}$/;

export function isValidCode(code: string): boolean {
  return CODE_RE.test(code);
}
