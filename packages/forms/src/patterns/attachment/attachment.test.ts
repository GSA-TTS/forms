import { describe, expect, it } from 'vitest';

import { parseUserInput } from './response.js';
import { type AttachmentPattern, parseConfigData } from './config.js';

describe('AttachmentPattern tests', () => {
  const defaultData: AttachmentPattern['data'] = {
    label: 'File upload',
    required: true,
    maxAttachments: 1,
    maxFileSizeMB: 10,
    allowedFileTypes: ['image/jpeg', 'application/pdf', 'image/png'],
  };

  describe('parseConfigData', () => {
    it('should create schema for required attachment', () => {
      const data = {
        ...defaultData,
      };

      const input = parseConfigData(data);
      expect(input.success).toBe(true);
    });

    it('should create schema for an optional attachment', () => {
      const data = {
        ...defaultData,
        required: false,
      };

      const input = parseConfigData(data);
      expect(input.success).toBe(true);
    });

    it('should accept a string of an allowed MIME type', () => {
      const data = {
        ...defaultData,
        allowedFileTypes: defaultData.allowedFileTypes[0],
      };

      const input = parseConfigData(data);
      expect(input.success).toBe(true);
    });

    it('should require at least 1 attachment type', () => {
      const data = {
        ...defaultData,
        allowedFileTypes: [],
      };

      const input = parseConfigData(data);
      expect((input as any).error).toStrictEqual({
        allowedFileTypes: {
          message: 'Invalid file type found.',
          type: 'required',
        },
      });
    });

    it('should require a valid attachment type', () => {
      const data = {
        ...defaultData,
        allowedFileTypes: ['invalid/mimetype'],
      };

      const input = parseConfigData(data);
      expect((input as any).error).toStrictEqual({
        allowedFileTypes: {
          message: 'Invalid input',
          type: 'custom',
        },
      });
    });

    it('should require all attachment types to be valid', () => {
      const data = {
        ...defaultData,
        allowedFileTypes: ['image/jpeg', 'invalid/mimetype'],
      };

      const input = parseConfigData(data);
      expect((input as any).error).toStrictEqual({
        allowedFileTypes: {
          message: 'Invalid input',
          type: 'custom',
        },
      });
    });

    it('should not allow humongous files', () => {
      const data = {
        ...defaultData,
        maxFileSizeMB: 10000000,
      };

      const input = parseConfigData(data);
      expect((input as any).error).toStrictEqual({
        maxFileSizeMB: {
          message: 'Number must be less than or equal to 10',
          type: 'custom',
        },
      });
    });

    it('should require positive integer of max attachments', () => {
      const data = {
        ...defaultData,
        maxAttachments: 0,
      };

      const input = parseConfigData(data);
      expect((input as any).error).toStrictEqual({
        maxAttachments: {
          message: 'Number must be greater than 0',
          type: 'custom',
        },
      });
    });
  });

  describe('parseUserInput', () => {
    it('accepts a single file with valid input', () => {
      const pattern = {
        id: '1',
        type: 'attachment',
        data: {
          ...defaultData,
        },
      };

      const file = new File(['abc123'], 'mock.jpg', { type: 'image/jpeg' });

      const input = parseUserInput(pattern, file);
      expect(input.success).toBe(true);
    });

    it('accepts multiple files with valid input', () => {
      const pattern = {
        id: '1',
        type: 'attachment',
        data: {
          ...defaultData,
          maxAttachments: 2,
        },
      };

      const file = new File(['abc123'], 'mock.jpg', { type: 'image/jpeg' });

      const input = parseUserInput(pattern, [file, file]);
      expect(input.success).toBe(true);
    });

    it('allows empty input if the field is not required', () => {
      const pattern = {
        id: '1',
        type: 'attachment',
        data: {
          ...defaultData,
          required: false,
        },
      };

      /**
       * this is what an empty input field with a type of file sends in its payload:
        `File {
          size: 0,
          type: 'application/octet-stream',
          name: '',
          lastModified: 1731954072461
        }`
       */
      const file = new File([], '', { type: 'application/octet-stream' });

      const input = parseUserInput(pattern, file);
      expect(input.success).toBe(true);
    });

    it('checks for too many attachments', () => {
      const pattern = {
        id: '1',
        type: 'attachment',
        data: {
          ...defaultData,
        },
      };

      const file = new File(['abc123'], 'mock.jpg', { type: 'image/jpeg' });

      const input = parseUserInput(
        pattern,
        Array(pattern.data.maxAttachments + 1).fill(file)
      );
      expect(input.success).toBe(false);
    });

    it('checks for valid attachment types', () => {
      const pattern = {
        id: '1',
        type: 'attachment',
        data: {
          ...defaultData,
        },
      };

      const file = new File(['abc123'], 'mock.txt', { type: 'text/plain' });

      const input = parseUserInput(pattern, [file]);
      expect(input.success).toBe(false);
    });

    it('checks for file size compliance', () => {
      const pattern = {
        id: '1',
        type: 'attachment',
        data: {
          ...defaultData,
          maxFileSizeMB: 0,
        },
      };

      const file = new File(['abc123'], 'mock.txt', { type: 'text/plain' });

      const input = parseUserInput(pattern, [file]);
      expect(input.success).toBe(false);
    });
  });
});
