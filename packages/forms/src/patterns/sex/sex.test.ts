import { describe, expect, it } from 'vitest';
import { createSexSchema, sexConfig, type SexPattern } from './sex';

describe('SexPattern tests', () => {
  describe('createSexSchema', () => {
    it('should create schema for required sex field', () => {
      const data: SexPattern['data'] = {
        label: 'Test Label',
        required: true,
        helperText: 'Helper text for sex field',
      };

      const schema = createSexSchema(data);
      expect(schema.safeParse({ sex: 'male' }).success).toBe(true);
      expect(schema.safeParse({ sex: 'female' }).success).toBe(true);
      expect(schema.safeParse({ sex: 'invalid' }).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(false);
      expect(() => schema.parse({})).toThrow();
    });

    it('should create schema for optional sex field', () => {
      const data: SexPattern['data'] = {
        label: 'Test Label',
        required: false,
        helperText: 'Helper text for sex field',
      };

      const schema = createSexSchema(data);
      expect(schema.safeParse({ sex: 'male' }).success).toBe(true);
      expect(schema.safeParse({ sex: 'female' }).success).toBe(true);
      expect(schema.safeParse({ sex: 'invalid' }).success).toBe(false);
      expect(schema.safeParse({}).success).toBe(true);
    });
  });

  describe('sexConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: SexPattern = {
        type: 'sex-input',
        id: 'test',
        data: {
          label: 'Test Sex Field',
          required: true,
          helperText: 'Helper text for sex field',
        },
      };

      const inputValue = { sex: 'male' };
      if (!sexConfig.parseUserInput) {
        expect.fail('sexConfig.parseUserInput is undefined');
      }
      const result = sexConfig.parseUserInput(pattern, inputValue);
      if (result.success) {
        expect(result.data.sex).toBe('male');
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: SexPattern = {
        type: 'sex-input',
        id: 'test',
        data: {
          label: 'Test Sex Field',
          required: true,
          helperText: 'Helper text for sex field',
        },
      };

      const inputValue = { sex: 'invalid' };
      if (!sexConfig.parseUserInput) {
        expect.fail('sexConfig.parseUserInput is undefined');
      }
      const result = sexConfig.parseUserInput(pattern, inputValue);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.message).toBe('Sex is required');
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Sex Field',
        required: true,
        helperText: 'Helper text for sex field',
      };

      if (!sexConfig.parseConfigData) {
        expect.fail('sexConfig.parseConfigData is undefined');
      }
      const result = sexConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test Sex Field');
        expect(result.data.required).toBe(true);
        expect(result.data.helperText).toBe('Helper text for sex field');
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        label: '',
        required: true,
        helperText: '',
      };

      if (!sexConfig.parseConfigData) {
        expect.fail('sexConfig.parseConfigData is undefined');
      }
      const result = sexConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
