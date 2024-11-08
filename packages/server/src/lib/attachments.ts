export const createMultipartResponse = (
  pdfs: { fileName: string; data: Uint8Array }[]
): Response => {
  const boundary = createBoundary();

  // Array to store each part of the multipart message
  const parts: Uint8Array[] = pdfs.flatMap(pdf => {
    const headers = [
      `--${boundary}`,
      `Content-Type: application/pdf`,
      `Content-Disposition: attachment; filename="${pdf.fileName}"`,
      '',
      '', // empty line between headers and content
    ].join('\r\n');

    return [stringToUint8Array(headers), pdf.data, stringToUint8Array('\r\n')];
  });

  // Final boundary to mark the end of the message
  parts.push(stringToUint8Array(`--${boundary}--`));

  // Concatenate all Uint8Array parts into a single Uint8Array body
  const body = new Uint8Array(
    parts.reduce((sum, part) => sum + part.length, 0)
  );
  let offset = 0;
  parts.forEach(part => {
    body.set(part, offset);
    offset += part.length;
  });

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': `multipart/mixed; boundary=${boundary}`,
      'Content-Length': body.length.toString(),
    },
  });
};

const createBoundary = (): string =>
  `boundary_${Math.random().toString(36).slice(2)}`;

const stringToUint8Array = (str: string): Uint8Array =>
  new TextEncoder().encode(str);
