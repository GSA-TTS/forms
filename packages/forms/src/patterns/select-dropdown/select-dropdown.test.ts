import { describe, expect, it } from 'vitest';
import {
  createSchema,
  selectDropdownConfig,
  type SelectDropdownPattern,
} from './select-dropdown';

describe('SelectDropdownPattern tests', () => {
  describe('createSchema', () => {
    it('should create schema for required dropdown', () => {
      const data: SelectDropdownPattern['data'] = {
        label: 'Test Label',
        required: true,
        options: [
          { value: 'value1', label: 'Option 1' },
          { value: 'value2', label: 'Option 2' },
        ],
      };

      const schema = createSchema(data);
      expect(schema.safeParse('value1').success).toBe(true);
      expect(schema.safeParse('value2').success).toBe(true);
      expect(schema.safeParse('invalid').success).toBe(false);
      expect(schema.safeParse('').success).toBe(false);
      expect(() => schema.parse('')).toThrow();
    });

    it('should create schema for optional dropdown', () => {
      const data: SelectDropdownPattern['data'] = {
        label: 'Test Label',
        required: false,
        options: [
          { value: 'value1', label: 'Option 1' },
          { value: 'value2', label: 'Option 2' },
        ],
      };

      const schema = createSchema(data);
      expect(schema.safeParse('value1').success).toBe(true);
      expect(schema.safeParse('value2').success).toBe(true);
      expect(schema.safeParse('invalid').success).toBe(false);
      expect(schema.safeParse('').success).toBe(true);
    });

    it('should throw error if no options are provided', () => {
      const data: SelectDropdownPattern['data'] = {
        label: 'Test Label',
        required: true,
        options: [],
      };

      expect(() => createSchema(data)).toThrow(
        'Options must have at least one value'
      );
    });
  });

  describe('selectDropdownConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: SelectDropdownPattern = {
        type: 'selectDropdown',
        id: 'test',
        data: {
          label: 'Test Dropdown',
          required: true,
          options: [
            { value: 'value1', label: 'Option 1' },
            { value: 'value2', label: 'Option 2' },
          ],
        },
      };

      const inputValue = 'value1';
      if (!selectDropdownConfig.parseUserInput) {
        expect.fail('selectDropdownConfig.parseUserInput is not undefined');
      }
      const result = selectDropdownConfig.parseUserInput(pattern, inputValue);
      if (result.success) {
        expect(result.data).toBe('value1');
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: SelectDropdownPattern = {
        type: 'selectDropdown',
        id: 'test',
        data: {
          label: 'Test Dropdown',
          required: true,
          options: [
            { value: 'value1', label: 'Option 1' },
            { value: 'value2', label: 'Option 2' },
          ],
        },
      };

      const inputValue = 'invalid';
      if (!selectDropdownConfig.parseUserInput) {
        expect.fail('selectDropdownConfig.parseUserInput is not undefined');
      }
      const result = selectDropdownConfig.parseUserInput(pattern, inputValue);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toBe(
          "Invalid enum value. Expected 'value1' | 'value2', received 'invalid'"
        );
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test Dropdown',
        required: true,
        options: [
          { value: 'value1', label: 'Option 1' },
          { value: 'value2', label: 'Option 2' },
        ],
      };

      if (!selectDropdownConfig.parseConfigData) {
        expect.fail('selectDropdownConfig.parseConfigData is not undefined');
      }
      const result = selectDropdownConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test Dropdown');
        expect(result.data.required).toBe(true);
        expect(result.data.options.length).toBe(2);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        label: '',
        required: true,
        options: [],
      };

      if (!selectDropdownConfig.parseConfigData) {
        expect.fail('selectDropdownConfig.parseConfigData is not undefined');
      }
      const result = selectDropdownConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
