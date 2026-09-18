import { CipherOptions, ConversionResult } from '../types/cipher';

function shiftChar(char: string, shift: number): string {
  const code = char.charCodeAt(0);

  // Uppercase A-Z (65-90)
  if (code >= 65 && code <= 90) {
    const normalizedShift = ((shift % 26) + 26) % 26;
    return String.fromCharCode(65 + ((code - 65 + normalizedShift) % 26));
  }

  // Lowercase a-z (97-122)
  if (code >= 97 && code <= 122) {
    const normalizedShift = ((shift % 26) + 26) % 26;
    return String.fromCharCode(97 + ((code - 97 + normalizedShift) % 26));
  }

  // Leave numbers, symbols, spaces, accents intact
  return char;
}

export function encodeCaesar(input: string, options: CipherOptions): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  const shift = Number.isFinite(options.caesarShift) ? options.caesarShift : 3;
  let result = '';

  for (let i = 0; i < input.length; i++) {
    result += shiftChar(input[i], shift);
  }

  return {
    success: true,
    result,
  };
}

export function decodeCaesar(input: string, options: CipherOptions): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  const shift = Number.isFinite(options.caesarShift) ? options.caesarShift : 3;
  // Inverse shift
  return encodeCaesar(input, { ...options, caesarShift: -shift });
}
