import QRCode from 'qrcode';

interface QRCodeData {
  modules: {
    size: number;
    data: Uint8Array;
    reservedBit: Uint8Array;
  };
}

interface BitMatrix {
  size: number;
  data: Uint8Array;
}

// Helper to get the raw module matrix
export const getQRMatrix = async (text: string, errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'): Promise<BitMatrix> => {
  try {
    // Using QRCode.create which returns the raw data object
    const data = await QRCode.create(text, { errorCorrectionLevel }) as unknown as QRCodeData;
    return data.modules; 
  } catch (err) {
    console.error("QR Generation Failed:", err);
    throw err;
  }
};

/**
 * Converts a QR module matrix to a standard ASCII string (1 char per module).
 * This results in a very wide QR code (since fonts are usually taller than wide).
 */
export const toAsciiText = (modules: BitMatrix, dark: string, light: string, invert: boolean): string => {
  if (!modules) return '';
  const size = modules.size;
  const data = modules.data;
  let output = '';

  // Top border
  output += light.repeat(size + 4) + '\n';
  output += light.repeat(size + 4) + '\n';

  for (let r = 0; r < size; r++) {
    output += light + light; // Left margin
    for (let c = 0; c < size; c++) {
      const isDark = !!data[r * size + c];
      // Logic: if invert is true, swap dark/light
      const char = (invert ? !isDark : isDark) ? dark : light;
      output += char;
    }
    output += light + light; // Right margin
    output += '\n';
  }

  // Bottom border
  output += light.repeat(size + 4) + '\n';
  output += light.repeat(size + 4);

  return output;
};

/**
 * Converts a QR module matrix to Unicode Block elements.
 * Uses ▀ (Upper half), ▄ (Lower half), █ (Full), and space.
 * This effectively doubles the vertical resolution, making it square-ish.
 */
export const toAsciiBlocks = (modules: BitMatrix, invert: boolean): string => {
  if (!modules) return '';
  const size = modules.size;
  const data = modules.data;
  let output = '';

  const getModule = (r: number, c: number) => {
    // Border logic
    if (r < 0 || r >= size || c < 0 || c >= size) {
      // The quiet zone is always "light" in QR standard.
      // If invert is FALSE (standard): Light is False. Return False.
      // If invert is TRUE (negative): Light is True (to make background dark). Return True.
      return invert; 
    }
    
    const val = !!data[r * size + c];
    return invert ? !val : val;
  };

  // We iterate rows by 2
  // We add a quiet zone (margin) of 2 "pixels" (which is 1 char height effectively)
  const margin = 2;

  for (let r = -margin; r < size + margin; r += 2) {
    for (let c = -margin; c < size + margin; c++) {
      const top = getModule(r, c);
      const bottom = getModule(r + 1, c);

      if (top && bottom) {
        output += '█';
      } else if (top && !bottom) {
        output += '▀';
      } else if (!top && bottom) {
        output += '▄';
      } else {
        output += ' ';
      }
    }
    output += '\n';
  }

  return output;
};