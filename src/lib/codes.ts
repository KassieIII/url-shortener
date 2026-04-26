import { customAlphabet } from "nanoid";
import { config } from "../config";

export { isValidCode } from "./code-validate";

const ALPHABET = "abcdefghijkmnopqrstuvwxyz23456789";

const generator = customAlphabet(ALPHABET, config.codeLength);

export function generateCode(): string {
  return generator();
}
