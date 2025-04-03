import { describe, expect, it } from 'vitest';
import {
  textAreaConfig,
  createTextAreaSchema,
  type TextAreaPattern,
  type TextAreaPatternOutput,
} from './text-area.js';

describe('TextAreaPattern tests', () => {
  describe('createTextAreaSchema', () => {
    it('should create schema for required TextArea input', () => {
      const data: TextAreaPattern['data'] = {
        label: 'Test TextArea Input Label',
        initial: '',
        required: true,
        hint: 'This is a hint',
      };

      const schema = createTextAreaSchema(data);
      const validInput = 'This is a valid input.';
      const invalidInput = '';

      expect(schema.safeParse(validInput).success).toBe(true);

      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0].message).toBe(
        'This field is required'
      );
    });

    it('should create schema for optional TextArea input', () => {
      const data: TextAreaPattern['data'] = {
        label: 'Test TextArea Input Label',
        initial: '',
        required: false,
        hint: 'This is a hint',
      };

      const schema = createTextAreaSchema(data);
      const validInput = 'This is a valid input.';
      const emptyInput = '';

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(emptyInput).success).toBe(true);
    });

    it('should handle repeated fields', () => {
      const data: TextAreaPattern['data'] = {
        label: 'Test Repeater TextArea Input Label',
        initial: '',
        required: true,
        hint: 'This is a hint',
      };

      const schema = createTextAreaSchema(data);
      const repeatedInput = {
        repeater: ['First input', 'Second input'],
      };

      expect(schema.safeParse(repeatedInput).success).toBe(true);
    });
  });

  describe('textAreaConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: TextAreaPattern = {
        type: 'text-area',
        id: 'test',
        data: {
          label: 'Test TextArea Input Label',
          initial: '',
          required: true,
          hint: 'This is a hint',
        },
      };

      const inputValue = 'This is a valid input.';
      if (!textAreaConfig.parseUserInput) {
        expect.fail('textAreaConfig.parseUserInput is undefined');
      }
      const result = textAreaConfig.parseUserInput(pattern, inputValue);
      if (result.success) {
        expect(result.data).toBe(inputValue);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: TextAreaPattern = {
        type: 'text-area',
        id: 'test',
        data: {
          label: 'Test TextArea Input Label',
          initial: '',
          required: true,
          hint: 'This is a hint',
        },
      };

      const invalidInput = '';
      if (!textAreaConfig.parseUserInput) {
        expect.fail('textAreaConfig.parseUserInput is undefined');
      }
      const result = textAreaConfig.parseUserInput(pattern, invalidInput);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain('This field is required');
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test TextArea Input Label',
        initial: '',
        required: true,
        hint: 'This is a hint',
      };

      if (!textAreaConfig.parseConfigData) {
        expect.fail('textAreaConfig.parseConfigData is undefined');
      }
      const result = textAreaConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test TextArea Input Label');
        expect(result.data.required).toBe(true);
        expect(result.data.hint).toBe('This is a hint');
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        label: '',
        initial: '',
        required: true,
        hint: 'This is a hint',
      };

      if (!textAreaConfig.parseConfigData) {
        expect.fail('textAreaConfig.parseConfigData is undefined');
      }
      const result = textAreaConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
