import { CipherOptions, ConversionResult } from '../types/cipher';

export function encodeAscii(input: string, options: CipherOptions): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  const nonAsciiChars: { char: string; index: number }[] = [];
  const asciiCodes: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code > 127) {
      nonAsciiChars.push({ char: input[i], index: i });
    } else {
      asciiCodes.push(code);
    }
  }

  if (nonAsciiChars.length > 0) {
    const uniqueChars = Array.from(new Set(nonAsciiChars.map((n) => n.char))).slice(0, 8);
    return {
      success: false,
      result: '',
      error: `Caracteres no compatibles con ASCII estándar (0-127): "${uniqueChars.join('", "')}". ASCII estándar solo admite caracteres del alfabeto inglés básico, dígitos y signos de puntuación ASCII. Para caracteres con tildes, 'ñ' o emojis, utiliza Codificación Hexadecimal, Binaria o Base64.`,
    };
  }

  const delimiter = options.byteSpacing !== false ? ' ' : ' ';
  return {
    success: true,
    result: asciiCodes.join(delimiter),
  };
}

export function decodeAscii(input: string): ConversionResult {
  if (!input.trim()) {
    return { success: true, result: '' };
  }

  const tokens = input.trim().split(/[\s,]+/);
  const outChars: string[] = [];
  const invalidTokens: string[] = [];
  const outOfRangeTokens: number[] = [];

  for (const token of tokens) {
    if (!token) continue;
    if (!/^\d+$/.test(token)) {
      invalidTokens.push(token);
      continue;
    }
    const val = parseInt(token, 10);
    if (val < 0 || val > 127) {
      outOfRangeTokens.push(val);
    } else {
      outChars.push(String.fromCharCode(val));
    }
  }

  if (invalidTokens.length > 0) {
    return {
      success: false,
      result: '',
      error: `Valores no numéricos encontrados: "${invalidTokens.slice(0, 5).join('", "')}". ASCII decimal solo acepta números entre 0 y 127 separados por espacios o comas.`,
    };
  }

  if (outOfRangeTokens.length > 0) {
    return {
      success: false,
      result: '',
      error: `Valores fuera del rango ASCII estándar (0-127): "${outOfRangeTokens.slice(0, 5).join(', ')}". El rango ASCII estándar comprende exclusivamente del código 0 al 127.`,
    };
  }

  return {
    success: true,
    result: outChars.join(''),
  };
}
