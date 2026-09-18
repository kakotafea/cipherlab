import { CipherOptions, ConversionResult } from '../types/cipher';
import { stringToUtf8Bytes, utf8BytesToString } from '../utils/encoding';

export function encodeHex(input: string, options: CipherOptions): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  try {
    const bytes = stringToUtf8Bytes(input);
    const hexArray = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0').toUpperCase());
    const delimiter = options.byteSpacing !== false ? ' ' : '';
    return {
      success: true,
      result: hexArray.join(delimiter),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al codificar en Hexadecimal: ${message}`,
    };
  }
}

export function decodeHex(input: string): ConversionResult {
  if (!input.trim()) {
    return { success: true, result: '' };
  }

  // Remove whitespace, dashes, colons, 0x, \x prefixes
  const cleaned = input
    .trim()
    .replace(/(?:0x|\\x)/gi, '')
    .replace(/[\s\-_:]/g, '');

  if (!cleaned) {
    return { success: true, result: '' };
  }

  // Check valid hex characters
  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    return {
      success: false,
      result: '',
      error: 'Hexadecimal inválido: contiene caracteres que no son dígitos hexadecimales (0-9, A-F).',
    };
  }

  if (cleaned.length % 2 !== 0) {
    return {
      success: false,
      result: '',
      error: 'Hexadecimal inválido: la longitud de caracteres hexadecimales debe ser par (cada byte requiere 2 dígitos).',
    };
  }

  try {
    const byteArray: number[] = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      const byteHex = cleaned.slice(i, i + 2);
      byteArray.push(parseInt(byteHex, 16));
    }

    const uint8 = new Uint8Array(byteArray);
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
      error: `Secuencia de bytes UTF-8 no válida al decodificar: ${message}`,
    };
  }
}
