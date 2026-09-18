import { ConversionResult } from '../types/cipher';
import { stringToUtf8Bytes, utf8BytesToString } from '../utils/encoding';

export function encodeBase64(input: string): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  try {
    const bytes = stringToUtf8Bytes(input);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return {
      success: true,
      result: base64,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al codificar en Base64: ${message}`,
    };
  }
}

export function decodeBase64(input: string): ConversionResult {
  if (!input.trim()) {
    return { success: true, result: '' };
  }

  const cleaned = input.trim().replace(/\s+/g, '');

  // Base64 pattern validation (letters, numbers, +, /, and optional = padding at end)
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned) || cleaned.length % 4 !== 0) {
    return {
      success: false,
      result: '',
      error: 'Base64 inválido: la cadena contiene caracteres no válidos o su longitud no es múltiplo de 4 con el relleno (=) correspondiente.',
    };
  }

  try {
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const text = utf8BytesToString(bytes);
    return {
      success: true,
      result: text,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al decodificar Base64: la secuencia no representa datos UTF-8 válidos (${message}).`,
    };
  }
}
