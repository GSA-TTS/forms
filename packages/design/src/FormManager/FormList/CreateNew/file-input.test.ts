import type { ChangeEvent } from 'react';
import { it, describe, expect, vi } from 'vitest';

import { onFileInputChangeGetFile } from './file-input.js';

describe('onFileInputChangeGetFile', () => {
  it('returns file details on file select', async () => {
    return new Promise<void>(resolve => {
      const setFile = vi.fn().mockImplementation(details => {
        expect(details).toEqual({
          name: 'file-name.xml',
          data: new Uint8Array(),
        });
        resolve();
      });
      const handler = onFileInputChangeGetFile(setFile);
      handler({
        target: {
          files: [new File([], 'file-name.xml')] as unknown as FileList,
        },
      } as ChangeEvent<HTMLInputElement>);
    });
  });
});
