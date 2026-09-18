import { CipherOptions, ConversionResult } from '../types/cipher';

const CHAR_TO_MORSE: Record<string, string> = {
  // Letters
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  // Numbers
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  // Punctuation & Symbols
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
  // Spanish Ñ
  Ñ: '--.--',
};

// Build reverse dictionary
const MORSE_TO_CHAR: Record<string, string> = {};
Object.entries(CHAR_TO_MORSE).forEach(([char, code]) => {
  MORSE_TO_CHAR[code] = char;
});

// Accent mapping for international accessibility
const ACCENT_MAP: Record<string, string> = {
  Á: 'A',
  É: 'E',
  Í: 'I',
  Ó: 'O',
  Ú: 'U',
  Ü: 'U',
  À: 'A',
  È: 'E',
  Ì: 'I',
  Ò: 'O',
  Ù: 'U',
  Â: 'A',
  Ê: 'E',
  Î: 'I',
  Ô: 'O',
  Û: 'U',
  Ä: 'A',
  Ë: 'E',
  Ï: 'I',
  Ö: 'O',
  Ç: 'C',
};

export function encodeMorse(input: string, options: CipherOptions): ConversionResult {
  if (!input) {
    return { success: true, result: '' };
  }

  const wordSeparator = options.morseSlashSeparator !== false ? ' / ' : '   ';
  const unmappedChars: string[] = [];

  // Normalize line breaks into spaces or words
  const words = input.split(/\s+/);
  const encodedWords = words.map((word) => {
    const letters = Array.from(word);
    const morseLetters = letters.map((rawChar) => {
      let char = rawChar.toUpperCase();
      if (ACCENT_MAP[char]) {
        char = ACCENT_MAP[char];
      }

      if (CHAR_TO_MORSE[char]) {
        return CHAR_TO_MORSE[char];
      }

      unmappedChars.push(rawChar);
      return `[${rawChar}]`;
    });

    return morseLetters.join(' ');
  });

  const result = encodedWords.join(wordSeparator);

  if (unmappedChars.length > 0) {
    const unique = Array.from(new Set(unmappedChars)).slice(0, 5);
    return {
      success: true,
      result,
      info: `Aviso: Los caracteres "${unique.join('", "')}" no tienen equivalencia en Código Morse internacional y se mantuvieron entre corchetes.`,
    };
  }

  return {
    success: true,
    result,
  };
}

export function decodeMorse(input: string): ConversionResult {
  if (!input.trim()) {
    return { success: true, result: '' };
  }

  // Handle words separated by '/' or 3+ spaces or newlines
  const raw = input.trim();

  // Words can be separated by '/' or multiple spaces
  const wordTokens = raw.split(/\s*\/\s*|\s{2,}|\n+/);
  const decodedWords: string[] = [];
  const invalidCodes: string[] = [];

  for (const wordToken of wordTokens) {
    if (!wordToken.trim()) continue;

    // Tokens inside a word are separated by single spaces
    const letterTokens = wordToken.trim().split(/\s+/);
    let decodedWord = '';

    for (const token of letterTokens) {
      if (!token) continue;
      if (MORSE_TO_CHAR[token]) {
        decodedWord += MORSE_TO_CHAR[token];
      } else {
        invalidCodes.push(token);
        decodedWord += '?';
      }
    }

    decodedWords.push(decodedWord);
  }

  const result = decodedWords.join(' ');

  if (invalidCodes.length > 0) {
    const uniqueInvalid = Array.from(new Set(invalidCodes)).slice(0, 6);
    return {
      success: false,
      result,
      error: `Secuencias Morse no reconocidas: "${uniqueInvalid.join('", "')}". Asegúrate de separar las letras con un espacio y las palabras con "/" o tres espacios.`,
    };
  }

  return {
    success: true,
    result,
  };
}
