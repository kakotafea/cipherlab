export type MethodCategory = 'encoding' | 'cipher' | 'code';

export type ConversionDirection = 'encode' | 'decode';

export interface ConversionResult {
  success: boolean;
  result: string;
  error?: string;
  info?: string;
}

export interface CipherOptions {
  caesarShift: number;
  vigenereKey: string;
  morseSlashSeparator: boolean;
  byteSpacing: boolean;
}

export interface CipherMethod {
  id: string;
  name: string;
  shortName: string;
  category: MethodCategory;
  description: string;
  badge?: string;
  encodeLabel?: string;
  decodeLabel?: string;
  supportsDecode: boolean;
  decodeUnsupportedReason?: string;
  requiresOptions?: boolean;
  encode: (input: string, options: CipherOptions) => ConversionResult;
  decode: (input: string, options: CipherOptions) => ConversionResult;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  methodId: string;
  methodName: string;
  direction: ConversionDirection;
  input: string;
  output: string;
}
