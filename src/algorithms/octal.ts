import { CipherOptions, ConversionResult } from '../types/cipher';
import { stringToUtf8Bytes, utf8BytesToString } from '../utils/encoding';

export function encodeOctal(input: string, options: CipherOptions): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  try {
    const bytes = stringToUtf8Bytes(input);
    const octalArray = Array.from(bytes).map((b) => b.toString(8).padStart(3, '0'));
    const delimiter = options.byteSpacing !== false ? ' ' : ' ';
    return {
      success: true,
      result: octalArray.join(delimiter),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al codificar en Octal: ${message}`,
    };
  }
}

export function decodeOctal(input: string): ConversionResult {
  if (!input.trim()) {
    return { success: true, result: '' };
  }

  const tokens = input.trim().split(/[\s,]+/);
  const bytes: number[] = [];
  const invalidTokens: string[] = [];

  for (const token of tokens) {
    if (!token) continue;
    // Check if token consists purely of octal digits (0-7)
    if (!/^[0-7]+$/.test(token)) {
      invalidTokens.push(token);
      continue;
    }
    const val = parseInt(token, 8);
    if (val < 0 || val > 255) {
      invalidTokens.push(`${token} (>255)`);
      continue;
    }
    bytes.push(val);
  }

  if (invalidTokens.length > 0) {
    return {
      success: false,
      result: '',
      error: `Octal inválido: se encontraron valores no válidos: "${invalidTokens.slice(0, 5).join('", "')}". Cada byte octal debe contener dígitos del 0 al 7 y un valor entre 0 y 377 (0-255 decimal).`,
    };
  }

  try {
    const uint8 = new Uint8Array(bytes);
    const text = utf8BytesToString(uint8);
    return {
      success: true,
      result: text,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al decodificar bytes octales a texto UTF-8: ${message}`,
    };
  }
}
