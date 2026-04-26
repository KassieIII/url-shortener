const CODE_RE = /^[a-z0-9]{4,16}$/;

export function isValidCode(code: string): boolean {
  return CODE_RE.test(code);
}
