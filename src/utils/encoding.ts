/**
 * Robust UTF-8 encoding and decoding utilities for Unicode, emojis and international characters.
 */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8', { fatal: true });

export function stringToUtf8Bytes(str: string): Uint8Array {
  return textEncoder.encode(str);
}

export function utf8BytesToString(bytes: Uint8Array): string {
  try {
    return textDecoder.decode(bytes);
  } catch {
    // Fallback if strict UTF-8 fails
    const nonStrictDecoder = new TextDecoder('utf-8');
    return nonStrictDecoder.decode(bytes);
  }
}

/**
 * Normalizes input by trimming surrounding whitespace for binary/hex/octal tokens,
 * while preserving spaces if meaningful.
 */
export function sanitizeTokenString(input: string): string[] {
  return input
    .trim()
    .split(/[\s,]+/)
    .filter((token) => token.length > 0);
}
