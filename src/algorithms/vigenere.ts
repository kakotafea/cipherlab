import { CipherOptions, ConversionResult } from '../types/cipher';

export function encodeVigenere(
  input: string,
  options: CipherOptions,
  direction: 'encode' | 'decode' = 'encode'
): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  const rawKey = (options.vigenereKey || '').trim();
  // Filter key to only alphabetic characters
  const cleanKey = rawKey.replace(/[^a-zA-Z]/g, '').toUpperCase();

  if (!cleanKey) {
    return {
      success: false,
      result: '',
      error: 'Clave de Vigenère inválida: se requiere una clave que contenga al menos una letra (A-Z).',
    };
  }

  const isDecode = direction === 'decode';
  let keyIndex = 0;
  let result = '';

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const code = char.charCodeAt(0);
    const keyShift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
    const effectiveShift = isDecode ? -keyShift : keyShift;

    // Uppercase A-Z
    if (code >= 65 && code <= 90) {
      const normalizedShift = ((effectiveShift % 26) + 26) % 26;
      result += String.fromCharCode(65 + ((code - 65 + normalizedShift) % 26));
      keyIndex++;
    }
    // Lowercase a-z
    else if (code >= 97 && code <= 122) {
      const normalizedShift = ((effectiveShift % 26) + 26) % 26;
      result += String.fromCharCode(97 + ((code - 97 + normalizedShift) % 26));
      keyIndex++;
    } else {
      // Non-alphabetic: preserve character without advancing key index
      result += char;
    }
  }

  return {
    success: true,
    result,
  };
}

export function decodeVigenere(input: string, options: CipherOptions): ConversionResult {
  return encodeVigenere(input, options, 'decode');
}
