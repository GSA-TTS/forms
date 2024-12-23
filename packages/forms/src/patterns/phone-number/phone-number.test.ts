import { describe, expect, it } from 'vitest';
import {
  createPhoneSchema,
  phoneNumberConfig,
  type PhoneNumberPattern,
} from './phone-number';

describe('PhoneNumberPattern tests', () => {
  describe('createPhoneSchema', () => {
    it('should create schema for required phone input', () => {
      const data: PhoneNumberPattern['data'] = {
        label: 'Test Phone Input Label',
        required: true,
      };

      const schema = createPhoneSchema(data);
      const validInput = '+12223334444';
      const invalidInput = '123456abc';

      expect(schema.safeParse(validInput).success).toBe(true);
      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0].message).toBe(
        'Phone number may only contain digits, spaces, parentheses, hyphens, and periods.'
      );
    });

    it('should create schema for optional phone input', () => {
      const data: PhoneNumberPattern['data'] = {
        label: 'Test Phone Input Label',
        required: false,
      };

      const schema = createPhoneSchema(data);
      const validInput = '+12223334444';
      const emptyInput = '';
      const invalidInput = '123456abc';

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(emptyInput).success).toBe(true);

      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0].message).toBe(
        'Phone number may only contain digits, spaces, parentheses, hyphens, and periods.'
      );
    });

    it('should fail with less than 10 digits', () => {
      const data: PhoneNumberPattern['data'] = {
        label: 'Test Phone Input Label',
        required: true,
      };

      const schema = createPhoneSchema(data);
      const shortInput = '123456789';

      const shortInputResult = schema.safeParse(shortInput);
      expect(shortInputResult.success).toBe(false);
      expect(shortInputResult.error?.issues[0].message).toBe(
        'Phone number must contain at least 10 digits'
      );
    });
  });

  describe('phoneNumberConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: PhoneNumberPattern = {
        type: 'phone-number',
        id: 'test',
        data: {
          label: 'Test Phone Input Label',
          required: true,
        },
      };

      const inputValue = '+12223334444';
      if (!phoneNumberConfig.parseUserInput) {
        expect.fail('phoneNumberConfig.parseUserInput is undefined');
      }
      const result = phoneNumberConfig.parseUserInput(pattern, inputValue);
      if (result.success) {
        expect(result.data).toBe(inputValue);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: PhoneNumberPattern = {
        type: 'phone-number',
        id: 'test',
        data: {
          label: 'Test Phone Input Label',
          required: true,
        },
      };

      const invalidInput = '123456abc';
      if (!phoneNumberConfig.parseUserInput) {
        expect.fail('phoneNumberConfig.parseUserInput is undefined');
      }
      const result = phoneNumberConfig.parseUserInput(pattern, invalidInput);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain(
          'Phone number may only contain digits, spaces, parentheses, hyphens, and periods.'
        );
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Phone Input Label',
        required: true,
      };

      if (!phoneNumberConfig.parseConfigData) {
        expect.fail('phoneNumberConfig.parseConfigData is undefined');
      }
      const result = phoneNumberConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test Phone Input Label');
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

      if (!phoneNumberConfig.parseConfigData) {
        expect.fail('phoneNumberConfig.parseConfigData is undefined');
      }
      const result = phoneNumberConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
