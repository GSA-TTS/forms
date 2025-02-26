import { describe, expect, it } from 'vitest';
import {
  createSSNSchema,
  socialSecurityNumberConfig,
  type SocialSecurityNumberPattern,
} from './social-security-number';

describe('SocialSecurityNumberPattern tests', () => {
  describe('createSSNSchema', () => {
    it('should create schema for required SSN input', () => {
      const data: SocialSecurityNumberPattern['data'] = {
        label: 'Test SSN Input Label',
        required: true,
      };

      const schema = createSSNSchema(data);
      const validInput = '555-11-1234';
      const invalidInput = '444-44-56as';

      expect(schema.safeParse(validInput).success).toBe(true);

      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0].message).toBe(
        'Social Security number must have exactly 9 digits'
      );
    });

    it('should create schema for optional SSN input', () => {
      const data: SocialSecurityNumberPattern['data'] = {
        label: 'Test SSN Input Label',
        required: false,
      };

      const schema = createSSNSchema(data);
      const validInput = '555-11-1234';
      const emptyInput = '';
      const invalidInput = '444-44-56as';

      expect(schema.safeParse(validInput).success).toBe(true);
      expect(schema.safeParse(emptyInput).success).toBe(true);

      const invalidResult = schema.safeParse(invalidInput);
      expect(invalidResult.success).toBe(false);
      expect(invalidResult.error?.issues[0].message).toBe(
        'Social Security number must have exactly 9 digits'
      );
    });

    it('should fail with less than 9 digits', () => {
      const data: SocialSecurityNumberPattern['data'] = {
        label: 'Test SSN Input Label',
        required: true,
      };

      const schema = createSSNSchema(data);
      const shortInput = '123-45-678';

      const shortInputResult = schema.safeParse(shortInput);
      expect(shortInputResult.success).toBe(false);
      expect(shortInputResult.error?.issues[0].message).toBe(
        'Social Security number must have exactly 9 digits'
      );
    });

    it('should fail with invalid SSN prefixes', () => {
      const data: SocialSecurityNumberPattern['data'] = {
        label: 'Test SSN Input Label',
        required: true,
      };

      const schema = createSSNSchema(data);
      const invalidSSNs = ['966-45-6789', '666-45-6789', '000-12-3456'];

      invalidSSNs.forEach(ssn => {
        const result = schema.safeParse(ssn);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toBe(
          'Social Security number must start with a valid prefix (not 9, 666, or 000)'
        );
      });
    });

    it('should fail with invalid middle and suffix digits', () => {
      const data: SocialSecurityNumberPattern['data'] = {
        label: 'Test SSN Input Label',
        required: true,
      };

      const schema = createSSNSchema(data);
      const invalidSSNs = ['555-00-6789', '555-12-0000'];

      invalidSSNs.forEach(ssn => {
        const result = schema.safeParse(ssn);
        expect(result.success).toBe(false);
        const errorMessage = result.error?.issues[0].message;
        if (ssn === '555-00-6789') {
          expect(errorMessage).toBe(
            'Social Security number must have a valid middle segment (not 00)'
          );
        } else if (ssn === '555-12-0000') {
          expect(errorMessage).toBe(
            'Social Security number must have a valid suffix (not 0000)'
          );
        }
      });
    });
  });

  describe('socialSecurityNumberConfig', () => {
    it('should parse user input correctly', () => {
      const pattern: SocialSecurityNumberPattern = {
        type: 'social-security-number',
        id: 'test',
        data: {
          label: 'Test SSN Input Label',
          required: true,
        },
      };

      const inputValue = '555-11-1234';
      if (!socialSecurityNumberConfig.parseUserInput) {
        expect.fail('socialSecurityNumberConfig.parseUserInput is undefined');
      }
      const result = socialSecurityNumberConfig.parseUserInput(
        pattern,
        inputValue
      );
      if (result.success) {
        expect(result.data).toBe(inputValue);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle validation error for user input', () => {
      const pattern: SocialSecurityNumberPattern = {
        type: 'social-security-number',
        id: 'test',
        data: {
          label: 'Test SSN Input Label',
          required: true,
        },
      };

      const invalidInput = '444-44-56as';
      if (!socialSecurityNumberConfig.parseUserInput) {
        expect.fail('socialSecurityNumberConfig.parseUserInput is undefined');
      }
      const result = socialSecurityNumberConfig.parseUserInput(
        pattern,
        invalidInput
      );
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error?.message).toContain(
          'Social Security number must have exactly 9 digits'
        );
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        label: 'Test SSN Input Label',
        required: true,
      };

      if (!socialSecurityNumberConfig.parseConfigData) {
        expect.fail('socialSecurityNumberConfig.parseConfigData is undefined');
      }
      const result = socialSecurityNumberConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.label).toBe('Test SSN Input Label');
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

      if (!socialSecurityNumberConfig.parseConfigData) {
        expect.fail('socialSecurityNumberConfig.parseConfigData is undefined');
      }
      const result = socialSecurityNumberConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
