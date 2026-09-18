import { ConversionResult } from '../types/cipher';
import { stringToUtf8Bytes, utf8BytesToString } from '../utils/encoding';

const RFC4648_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function encodeBase32(input: string): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  try {
    const bytes = stringToUtf8Bytes(input);
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;

      while (bits >= 5) {
        output += RFC4648_ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += RFC4648_ALPHABET[(value << (5 - bits)) & 31];
    }

    while (output.length % 8 !== 0) {
      output += '=';
    }

    return {
      success: true,
      result: output,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al codificar en Base32: ${message}`,
    };
  }
}

export function decodeBase32(input: string): ConversionResult {
  if (!input.trim()) {
    return { success: true, result: '' };
  }

  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '');

  // Strip padding for validation
  const unpadded = cleaned.replace(/=+$/, '');

  // Validate characters
  for (let i = 0; i < unpadded.length; i++) {
    const char = unpadded[i];
    if (!RFC4648_ALPHABET.includes(char)) {
      return {
        success: false,
        result: '',
        error: `Base32 inválido: contiene el carácter no permitido "${char}". Base32 estándar solo admite letras A-Z y números 2-7.`,
      };
    }
  }

  try {
    let bits = 0;
    let value = 0;
    const bytes: number[] = [];

    for (let i = 0; i < unpadded.length; i++) {
      const val = RFC4648_ALPHABET.indexOf(unpadded[i]);
      value = (value << 5) | val;
      bits += 5;

      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

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
      error: `Error al decodificar Base32 a texto: ${message}`,
    };
  }
}
