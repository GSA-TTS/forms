import { describe, expect, it } from 'vitest';
import { createNameSchema, nameConfig, type NamePattern } from './index';

describe('NamePattern tests', () => {
  describe('createNameSchema', () => {
    it('should create schema for required name input', () => {
      const data: NamePattern['data'] = {
        label: 'Test Name Label',
        required: true,
        givenNameHint: 'Enter your first name',
        familyNameHint: 'Enter your last name',
      };

      const schema = createNameSchema(data);
      const validInput = { givenName: 'John', familyName: 'Doe' };
      const invalidInput = { givenName: '', familyName: '' };

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(invalidInput).success).toBe(false);
    });

    it('should create schema for optional name input', () => {
      const data: NamePattern['data'] = {
        label: 'Test Name Label',
        required: false,
      };

      const schema = createNameSchema(data);
      const validInput = { givenName: 'John', familyName: 'Doe' };
      const emptyInput = { givenName: '', familyName: '' };

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(emptyInput).success).toBe(true);
    });
  });

  describe('nameConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: NamePattern = {
        id: 'name-1',
        type: 'name-input',
        data: {
          label: 'Test Name Label',
          required: true,
          givenNameHint: 'Enter your first name',
          familyNameHint: 'Enter your last name',
        },
      };

      const inputValue = { givenName: 'John', familyName: 'Doe' };
      if (!nameConfig.parseUserInput) {
        expect.fail('nameConfig.parseUserInput is undefined');
      }
      const result = nameConfig.parseUserInput(pattern, inputValue);

      if (result.success) {
        expect(result.data).toEqual(inputValue);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: NamePattern = {
        id: 'name-1',
        type: 'name-input',
        data: {
          label: 'Test Name Label',
          required: true,
          givenNameHint: 'Enter your first name',
          familyNameHint: 'Enter your last name',
        },
      };

      const inputValue = { givenName: '', familyName: '' };
      if (!nameConfig.parseUserInput) {
        expect.fail('nameConfig.parseUserInput is undefined');
      }
      const result = nameConfig.parseUserInput(pattern, inputValue);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Name Label',
        required: true,
        givenNameHint: 'Enter your first name',
        familyNameHint: 'Enter your last name',
      };

      if (!nameConfig.parseConfigData) {
        expect.fail('nameConfig.parseConfigData is undefined');
      }
      const result = nameConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test Name Label');
        expect(result.data.required).toBe(true);
        expect(result.data.givenNameHint).toBe('Enter your first name');
        expect(result.data.familyNameHint).toBe('Enter your last name');
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        label: '',
        required: true,
      };

      if (!nameConfig.parseConfigData) {
        expect.fail('nameConfig.parseConfigData is undefined');
      }
      const result = nameConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
