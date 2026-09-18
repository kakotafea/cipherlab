import { ConversionResult } from '../types/cipher';

function rot13Char(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(65 + ((code - 65 + 13) % 26));
  }
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(97 + ((code - 97 + 13) % 26));
  }
  return char;
}

export function encodeRot13(input: string): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += rot13Char(input[i]);
  }

  return {
    success: true,
    result,
  };
}

export function decodeRot13(input: string): ConversionResult {
  return encodeRot13(input);
}
