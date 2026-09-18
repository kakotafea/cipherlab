import { ConversionResult } from '../types/cipher';

export function encodeUrl(input: string): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  try {
    const encoded = encodeURIComponent(input);
    return {
      success: true,
      result: encoded,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al codificar URL: ${message}`,
    };
  }
}

export function decodeUrl(input: string): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  try {
    const decoded = decodeURIComponent(input);
    return {
      success: true,
      result: decoded,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `URL Encoding inválido: la cadena contiene una secuencia de escape porcentual (%XX) incompleta o no válida (${message}).`,
    };
  }
}
