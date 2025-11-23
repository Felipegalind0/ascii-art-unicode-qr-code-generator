export enum QRMode {
  BLOCK = 'BLOCK', // Uses █ ▀ ▄ for better aspect ratio
  TEXT = 'TEXT',   // Uses arbitrary characters (e.g., # and .)
}

export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

export interface AsciiTheme {
  name: string;
  darkChar: string;
  lightChar: string;
  description?: string;
}

export interface GenerateOptions {
  text: string;
  ecLevel: ErrorCorrectionLevel;
  mode: QRMode;
  darkChar: string;
  lightChar: string;
  invert: boolean;
}