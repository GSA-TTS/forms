/**
 * Converts a given string input into its Base64 encoded representation.
 *
 * This function uses different methods depending on the environment:
 * - In Node.js environments, it uses the Buffer API.
 * - In browser environments, it utilizes the TextEncoder API.
 */
export const stringToBase64 = (input: string): string => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(input, 'utf-8').toString('base64');
  } else {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(input);
    let binaryString = encoded.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ''
    );
    return window.btoa(binaryString);
  }
};

/**
 * Converts a Uint8Array instance into a Base64-encoded string.
 *
 * This function uses different methods depending on the environment:
 * - In Node.js environments, it uses the Buffer API.
 * - In browser environments, it utilizes the FileReader API.
 */
export const uint8ArrayToBase64 = async (uint8Array: Uint8Array) => {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(uint8Array).toString('base64');
  }
  return new Promise<string>((resolve, reject) => {
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
    const reader = new FileReader();
    reader.onloadend = function () {
      // Convert the data URL to a base64 string
      const base64 = (this.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Converts a base64 encoded string to a Uint8Array.
 */
export const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
