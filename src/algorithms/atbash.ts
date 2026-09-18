import { ConversionResult } from '../types/cipher';

function atbashChar(char: string): string {
  const code = char.charCodeAt(0);

  // A-Z (65-90): 'A' becomes 'Z', 'B' becomes 'Y' => 65 + 90 - code = 155 - code
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(155 - code);
  }

  // a-z (97-122): 'a' becomes 'z', 'b' becomes 'y' => 97 + 122 - code = 219 - code
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(219 - code);
  }

  return char;
}

export function encodeAtbash(input: string): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  let result = '';
  for (let i = 0; i < input.length; i++) {
    result += atbashChar(input[i]);
  }

  return {
    success: true,
    result,
  };
}

export function decodeAtbash(input: string): ConversionResult {
  return encodeAtbash(input);
}
