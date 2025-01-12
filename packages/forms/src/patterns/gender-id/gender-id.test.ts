import { describe, expect, it } from 'vitest';
import {
  createGenderIdSchema,
  genderIdConfig,
  type GenderIdPattern,
  type GenderIdPatternOutput,
} from './gender-id';

describe('GenderIdPattern tests', () => {
  describe('createGenderIdSchema', () => {
    it('should create schema for required gender identity input', () => {
      const data: GenderIdPattern['data'] = {
        label: 'Test Gender Identity Label',
        required: true,
        preferNotToAnswerText: 'Prefer not to share my gender identity',
      };

      const schema = createGenderIdSchema(data);
      const validInput = { input: 'Test Gender' };
      const invalidInput = { input: '' };
      const preferNotToAnswerInput = {
        preferNotToAnswer: 'Prefer not to share my gender identity',
      };

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(invalidInput).success).toBe(false);
      expect(schema.safeParse(preferNotToAnswerInput).success).toBe(true);
    });

    it('should create schema for optional gender identity input', () => {
      const data: GenderIdPattern['data'] = {
        label: 'Test Gender Identity Label',
        required: false,
      };

      const schema = createGenderIdSchema(data);
      const validInput = { input: 'Test Gender' };
      const emptyInput = { input: '' };

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(emptyInput).success).toBe(true);
    });
  });

  describe('genderIdConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: GenderIdPattern = {
        id: 'gender-identity-1',
        type: 'gender-id',
        data: {
          label: 'Test Gender Identity Label',
          required: true,
          preferNotToAnswerText: 'Prefer not to share my gender identity',
        },
      };

      const inputValue = { input: 'Test Gender' };
      if (!genderIdConfig.parseUserInput) {
        expect.fail('genderIdConfig.parseUserInput is undefined');
      }
      const result = genderIdConfig.parseUserInput(pattern, inputValue);
      if (result.success) {
        expect(result.data).toEqual(inputValue);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: GenderIdPattern = {
        id: 'gender-identity-1',
        type: 'gender-id',
        data: {
          label: 'Test Gender Identity Label',
          required: true,
          preferNotToAnswerText: 'Prefer not to share my gender identity',
        },
      };

      const inputValue = { input: '' };
      if (!genderIdConfig.parseUserInput) {
        expect.fail('genderIdConfig.parseUserInput is undefined');
      }
      const result = genderIdConfig.parseUserInput(pattern, inputValue);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Gender Identity Label',
        required: true,
        hint: 'For example, man, woman, non-binary',
        preferNotToAnswerText: 'Prefer not to share my gender identity',
      };

      if (!genderIdConfig.parseConfigData) {
        expect.fail('genderIdConfig.parseConfigData is undefined');
      }
      const result = genderIdConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test Gender Identity Label');
        expect(result.data.required).toBe(true);
        expect(result.data.hint).toBe('For example, man, woman, non-binary');
        expect(result.data.preferNotToAnswerText).toBe(
          'Prefer not to share my gender identity'
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

      if (!genderIdConfig.parseConfigData) {
        expect.fail('genderIdConfig.parseConfigData is undefined');
      }
      const result = genderIdConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
