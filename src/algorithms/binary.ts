import { CipherOptions, ConversionResult } from '../types/cipher';
import { stringToUtf8Bytes, utf8BytesToString } from '../utils/encoding';

export function encodeBinary(input: string, options: CipherOptions): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  try {
    const bytes = stringToUtf8Bytes(input);
    const binArray = Array.from(bytes).map((b) => b.toString(2).padStart(8, '0'));
    const delimiter = options.byteSpacing !== false ? ' ' : '';
    return {
      success: true,
      result: binArray.join(delimiter),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      result: '',
      error: `Error al codificar en binario: ${message}`,
    };
  }
}

export function decodeBinary(input: string): ConversionResult {
  if (!input.trim()) {
    return { success: true, result: '' };
  }

  // Remove whitespace and delimiters
  const cleaned = input.trim().replace(/[\s\-_,:]/g, '');

  if (!cleaned) {
    return { success: true, result: '' };
  }

  // Check valid binary characters (0 and 1 only)
  if (!/^[01]+$/.test(cleaned)) {
    return {
      success: false,
      result: '',
      error: 'Binario inválido: la entrada solo debe contener ceros (0), unos (1) y espacios separadores.',
    };
  }

  if (cleaned.length % 8 !== 0) {
    return {
      success: false,
      result: '',
      error: `Binario incompleto: se encontraron ${cleaned.length} bits. La longitud debe ser múltiplo de 8 bits (1 byte) para decodificar texto UTF-8.`,
    };
  }

  try {
    const bytes: number[] = [];
    for (let i = 0; i < cleaned.length; i += 8) {
      const byteStr = cleaned.slice(i, i + 8);
      bytes.push(parseInt(byteStr, 2));
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
      error: `Error al decodificar bytes binarios a texto: ${message}`,
    };
  }
}
