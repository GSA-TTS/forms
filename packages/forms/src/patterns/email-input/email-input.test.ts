import { describe, expect, it } from 'vitest';
import {
  createEmailSchema,
  emailInputConfig,
  type EmailInputPattern,
} from './email-input';

describe('EmailInputPattern tests', () => {
  describe('createEmailSchema', () => {
    it('should create schema for required email input', () => {
      const data: EmailInputPattern['data'] = {
        label: 'Test Email Input Label',
        required: true,
      };

      const schema = createEmailSchema(data);
      const validInput = { email: 'testEmail@test.com' };
      const invalidInput = { email: 'testEmail.com' };

      expect(schema.safeParse(validInput).success).toBe(true);
      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0]?.message).toBe(
        'Invalid email format'
      );
    });

    it('should create schema for optional email input', () => {
      const data: EmailInputPattern['data'] = {
        label: 'Test Email Input Label',
        required: false,
      };

      const schema = createEmailSchema(data);
      const validInput = { email: 'testEmail@test.com' };
      const emptyInput = { email: '' };

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(emptyInput).success).toBe(true);
    });
  });

  describe('emailInputConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: EmailInputPattern = {
        type: 'email-input',
        id: 'test',
        data: {
          label: 'Test Email Input Label',
          required: true,
        },
      };

      const inputValue = { email: 'testEmail@test.com' };
      if (!emailInputConfig.parseUserInput) {
        expect.fail('emailInputConfig.parseUserInput is undefined');
      }
      const result = emailInputConfig.parseUserInput(pattern, inputValue);
      if (result.success) {
        expect(result.data).toEqual(inputValue);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: EmailInputPattern = {
        type: 'email-input',
        id: 'test',
        data: {
          label: 'Test Email Input Label',
          required: true,
        },
      };

      const inputValue = { email: 'testEmail.co' };
      if (!emailInputConfig.parseUserInput) {
        expect.fail('emailInputConfig.parseUserInput is undefined');
      }
      const result = emailInputConfig.parseUserInput(pattern, inputValue);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Email Input Label',
        required: true,
      };

      if (!emailInputConfig.parseConfigData) {
        expect.fail('emailInputConfig.parseConfigData is undefined');
      }
      const result = emailInputConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test Email Input Label');
        expect(result.data.required).toBe(true);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        label: '',
        required: true,
      };

      if (!emailInputConfig.parseConfigData) {
        expect.fail('emailInputConfig.parseConfigData is undefined');
      }
      const result = emailInputConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
