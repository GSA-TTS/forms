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
      const validInputs = ['2223334444', '222-333-4444'];
      const invalidInput = '123456abc';

      validInputs.forEach(input => {
        const result = schema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe('222-333-4444');
        }
      });

      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0].message).toBe(
        'Invalid phone number format.'
      );
    });

    it('should create schema for optional phone input', () => {
      const data: PhoneNumberPattern['data'] = {
        label: 'Test Phone Input Label',
        required: false,
      };

      const schema = createPhoneSchema(data);
      const validInput = '2223334444';
      const emptyInput = '';
      const invalidInput = '123456abc';

      const validResult = schema.safeParse(validInput);
      expect(validResult.success).toBe(true);
      if (validResult.success) {
        expect(validResult.data).toBe('222-333-4444');
      }

      expect(schema.safeParse(emptyInput).success).toBe(true);

      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0].message).toBe(
        'Invalid phone number format.'
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
        'Invalid phone number format.'
      );
    });

    it('should fail with more than 10 digits', () => {
      const data: PhoneNumberPattern['data'] = {
        label: 'Test Phone Input Label',
        required: true,
      };

      const schema = createPhoneSchema(data);
      const longInput = '12345678901';

      const longInputResult = schema.safeParse(longInput);
      expect(longInputResult.success).toBe(false);
      expect(longInputResult.error?.issues[0].message).toBe(
        'Invalid phone number format.'
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

      const inputValue = '2223334444';
      if (!phoneNumberConfig.parseUserInput) {
        expect.fail('phoneNumberConfig.parseUserInput is undefined');
      }
      const result = phoneNumberConfig.parseUserInput(pattern, inputValue);

      if (result.success) {
        expect(result.data).toBe('222-333-4444');
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
        expect(result.error?.message).toContain('Invalid phone number format.');
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Phone Input Label',
        required: true,
        hint: 'Enter a 10-digit U.S. phone number, e.g., 999-999-9999',
      };

      if (!phoneNumberConfig.parseConfigData) {
        expect.fail('phoneNumberConfig.parseConfigData is undefined');
      }
      const result = phoneNumberConfig.parseConfigData(obj);

      if (result.success) {
        expect(result.data.label).toBe('Test Phone Input Label');
        expect(result.data.required).toBe(true);
        expect(result.data.hint).toBe(
          'Enter a 10-digit U.S. phone number, e.g., 999-999-9999'
        );
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
