import { describe, expect, it } from 'vitest';
import {
  createDOBSchema,
  dateOfBirthConfig,
  type DateOfBirthPattern,
} from './date-of-birth';

describe('DateOfBirthPattern tests', () => {
  describe('createDOBSchema', () => {
    it('should create schema for required date of birth', () => {
      const data: DateOfBirthPattern['data'] = {
        label: 'Test Label',
        required: true,
        hint: 'Enter your date of birth',
      };

      const schema = createDOBSchema(data);
      const validInput = { month: '03', day: '15', year: '1990' };
      const invalidInput = { month: '13', day: '32', year: '199x' };

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(invalidInput).success).toBe(false);
    });

    it('should create schema for optional date of birth', () => {
      const data: DateOfBirthPattern['data'] = {
        label: 'Test Label',
        required: false,
        hint: 'Enter your date of birth',
      };

      const schema = createDOBSchema(data);
      const validInput = { month: '03', day: '15', year: '1990' };
      const emptyInput = {};

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(emptyInput).success).toBe(true);
    });
  });

  describe('dateOfBirthConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: DateOfBirthPattern = {
        type: 'date-of-birth',
        id: 'test',
        data: {
          label: 'Test Date of Birth',
          required: true,
          hint: 'Enter your date of birth',
        },
      };

      const inputValue = { month: '03', day: '15', year: '1990' };
      if (!dateOfBirthConfig.parseUserInput) {
        expect.fail('dateOfBirthConfig.parseUserInput is not undefined');
      }
      const result = dateOfBirthConfig.parseUserInput(pattern, inputValue);
      if (result.success) {
        expect(result.data).toEqual(inputValue);
      } else {
        throw new Error('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: DateOfBirthPattern = {
        type: 'date-of-birth',
        id: 'test',
        data: {
          label: 'Test Date of Birth',
          required: true,
          hint: 'Enter your date of birth',
        },
      };

      const inputValue = { month: '13', day: '32', year: '199x' };
      if (!dateOfBirthConfig.parseUserInput) {
        expect.fail('dateOfBirthConfig.parseUserInput is not undefined');
      }
      const result = dateOfBirthConfig.parseUserInput(pattern, inputValue);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        throw new Error('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Date of Birth',
        required: true,
        hint: 'Enter your date of birth',
      };

      if (!dateOfBirthConfig.parseConfigData) {
        expect.fail('dateOfBirthConfig.parseConfigData is not undefined');
      }
      const result = dateOfBirthConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test Date of Birth');
        expect(result.data.required).toBe(true);
        expect(result.data.hint).toBe('Enter your date of birth');
      } else {
        throw new Error('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        label: '',
        required: true,
        hint: '',
      };

      if (!dateOfBirthConfig.parseConfigData) {
        expect.fail('dateOfBirthConfig.parseConfigData is not undefined');
      }
      const result = dateOfBirthConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        throw new Error('Unexpected validation success');
      }
    });
  });
});
