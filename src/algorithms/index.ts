import { CipherMethod, MethodCategory } from '../types/cipher';
import { decodeHex, encodeHex } from './hexadecimal';
import { decodeBinary, encodeBinary } from './binary';
import { decodeAscii, encodeAscii } from './ascii';
import { decodeOctal, encodeOctal } from './octal';
import { decodeBase64, encodeBase64 } from './base64';
import { decodeBase32, encodeBase32 } from './base32';
import { decodeUrl, encodeUrl } from './url';
import { decodeMorse, encodeMorse } from './morse';
import { decodeCaesar, encodeCaesar } from './caesar';
import { decodeRot13, encodeRot13 } from './rot13';
import { decodeAtbash, encodeAtbash } from './atbash';
import { decodeVigenere, encodeVigenere } from './vigenere';

export const CIPHER_METHODS: CipherMethod[] = [
  // --- Codificación ---
  {
    id: 'hex',
    name: 'Hexadecimal',
    shortName: 'HEX',
    category: 'encoding',
    description: 'Convierte bytes UTF-8 a su representación base 16 (0-9, A-F).',
    badge: 'Base 16',
    encodeLabel: 'Texto → Hexadecimal',
    decodeLabel: 'Hexadecimal → Texto',
    supportsDecode: true,
    requiresOptions: true,
    encode: encodeHex,
    decode: (input) => decodeHex(input),
  },
  {
    id: 'binary',
    name: 'Binario',
    shortName: 'BIN',
    category: 'encoding',
    description: 'Transforma texto a secuencias de 8 bits (0s y 1s) mediante UTF-8.',
    badge: 'Base 2',
    encodeLabel: 'Texto → Binario',
    decodeLabel: 'Binario → Texto',
    supportsDecode: true,
    requiresOptions: true,
    encode: encodeBinary,
    decode: (input) => decodeBinary(input),
  },
  {
    id: 'ascii',
    name: 'ASCII Decimal',
    shortName: 'ASCII',
    category: 'encoding',
    description: 'Representa caracteres en sus códigos numéricos estándar (0-127).',
    badge: '7-bit',
    encodeLabel: 'Texto → Códigos ASCII',
    decodeLabel: 'Códigos ASCII → Texto',
    supportsDecode: true,
    requiresOptions: false,
    encode: encodeAscii,
    decode: (input) => decodeAscii(input),
  },
  {
    id: 'octal',
    name: 'Octal',
    shortName: 'OCT',
    category: 'encoding',
    description: 'Convierte bytes UTF-8 a sistema octal en base 8 (dígitos del 0 al 7).',
    badge: 'Base 8',
    encodeLabel: 'Texto → Octal',
    decodeLabel: 'Octal → Texto',
    supportsDecode: true,
    requiresOptions: true,
    encode: encodeOctal,
    decode: (input) => decodeOctal(input),
  },
  {
    id: 'base64',
    name: 'Base64',
    shortName: 'B64',
    category: 'encoding',
    description: 'Codificación binario-a-texto estándar RFC 4648 con soporte Unicode.',
    badge: 'Base 64',
    encodeLabel: 'Texto → Base64',
    decodeLabel: 'Base64 → Texto',
    supportsDecode: true,
    requiresOptions: false,
    encode: (input) => encodeBase64(input),
    decode: (input) => decodeBase64(input),
  },
  {
    id: 'base32',
    name: 'Base32',
    shortName: 'B32',
    category: 'encoding',
    description: 'Codificación mediante alfabeto de 32 caracteres seguros (A-Z, 2-7).',
    badge: 'Base 32',
    encodeLabel: 'Texto → Base32',
    decodeLabel: 'Base32 → Texto',
    supportsDecode: true,
    requiresOptions: false,
    encode: (input) => encodeBase32(input),
    decode: (input) => decodeBase32(input),
  },
  {
    id: 'url',
    name: 'URL Encoding',
    shortName: 'URL',
    category: 'encoding',
    description: 'Codifica caracteres especiales en formato de porcentaje (%XX) para URLs.',
    badge: 'URI',
    encodeLabel: 'Texto → URL Porcentual',
    decodeLabel: 'URL Porcentual → Texto',
    supportsDecode: true,
    requiresOptions: false,
    encode: (input) => encodeUrl(input),
    decode: (input) => decodeUrl(input),
  },

  // --- Cifrados ---
  {
    id: 'caesar',
    name: 'César',
    shortName: 'CÉSAR',
    category: 'cipher',
    description: 'Cifrado clásico por sustitución monoalfabética con desplazamiento.',
    badge: 'Sustitución',
    encodeLabel: 'Cifrar (César)',
    decodeLabel: 'Descifrar (César)',
    supportsDecode: true,
    requiresOptions: true,
    encode: encodeCaesar,
    decode: decodeCaesar,
  },
  {
    id: 'rot13',
    name: 'ROT13',
    shortName: 'ROT13',
    category: 'cipher',
    description: 'Cifrado simétrico de desplazamiento fijo de 13 posiciones.',
    badge: 'Simétrico',
    encodeLabel: 'Cifrar (ROT13)',
    decodeLabel: 'Descifrar (ROT13)',
    supportsDecode: true,
    requiresOptions: false,
    encode: (input) => encodeRot13(input),
    decode: (input) => decodeRot13(input),
  },
  {
    id: 'atbash',
    name: 'Atbash',
    shortName: 'ATBASH',
    category: 'cipher',
    description: 'Cifrado hebreo clásico que invierte el alfabeto (A↔Z, B↔Y).',
    badge: 'Inversión',
    encodeLabel: 'Cifrar (Atbash)',
    decodeLabel: 'Descifrar (Atbash)',
    supportsDecode: true,
    requiresOptions: false,
    encode: (input) => encodeAtbash(input),
    decode: (input) => decodeAtbash(input),
  },
  {
    id: 'vigenere',
    name: 'Vigenère',
    shortName: 'VIGENÈRE',
    category: 'cipher',
    description: 'Cifrado polialfabético que utiliza una clave de texto cíclica.',
    badge: 'Polialfabético',
    encodeLabel: 'Cifrar (Vigenère)',
    decodeLabel: 'Descifrar (Vigenère)',
    supportsDecode: true,
    requiresOptions: true,
    encode: (input, options) => encodeVigenere(input, options, 'encode'),
    decode: (input, options) => decodeVigenere(input, options),
  },

  // --- Códigos ---
  {
    id: 'morse',
    name: 'Morse',
    shortName: 'MORSE',
    category: 'code',
    description: 'Transmisión telegráfica de puntos y rayas según el estándar internacional.',
    badge: 'Telegráfico',
    encodeLabel: 'Texto → Código Morse',
    decodeLabel: 'Código Morse → Texto',
    supportsDecode: true,
    requiresOptions: true,
    encode: encodeMorse,
    decode: (input) => decodeMorse(input),
  },
];

export const CATEGORY_LABELS: Record<MethodCategory, { label: string; description: string }> = {
  encoding: {
    label: 'Codificación',
    description: 'Conversiones estándar de representación de datos y bytes',
  },
  cipher: {
    label: 'Cifrados',
    description: 'Algoritmos criptográficos clásicos y sustituciones',
  },
  code: {
    label: 'Códigos',
    description: 'Sistemas de señales y transmisión simbólica',
  },
};

export function getMethodById(id: string): CipherMethod {
  const found = CIPHER_METHODS.find((m) => m.id === id);
  return found || CIPHER_METHODS[0];
}
