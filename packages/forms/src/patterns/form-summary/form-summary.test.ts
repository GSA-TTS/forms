import { describe, expect, it } from 'vitest';
import {
    formSummaryConfig,
    type FormSummaryPattern,
} from './form-summary';
import { type FormSummaryProps } from '../../components.js';

describe('FormSummaryPattern tests', () => {
  describe('createFormSummarySchema', () => {
    it('should parse valid config data', () => {
      const data: FormSummaryPattern['data'] = {
        title: 'Valid Form Title',
        description: 'This is a valid form description',
      };

      if (!formSummaryConfig.parseConfigData) {
        expect.fail('formSummaryConfig.parseConfigData is undefined');
      }
      const result = formSummaryConfig.parseConfigData(data);
      expect(result.success).toBe(true);
    });

    it('should handle empty title in config data', () => {
      const obj = {
        title: '',
        description: 'This is a valid form description',
      };

      if (!formSummaryConfig.parseConfigData) {
        expect.fail('formSummaryConfig.parseConfigData is undefined');
      }
      const result = formSummaryConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.title).toBeDefined();

        const titleErrors = result.error.title;
        if (Array.isArray(titleErrors)) {
          expect(titleErrors[0].message).toContainEqual('Title is required');
        } else {
          expect(result.error.title.message).toBe('Title is required');
        }
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should handle excessively long title in config data', () => {
      const data: FormSummaryPattern['data'] = {
        title: 'A'.repeat(129), // 129 characters
        description: 'This is a valid form description',
      };

      if (!formSummaryConfig.parseConfigData) {
        expect.fail('formSummaryConfig.parseConfigData is undefined');
      }
      const result = formSummaryConfig.parseConfigData(data);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.title).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should handle excessively long description in config data', () => {
      const data: FormSummaryPattern['data'] =  {
        title: 'Valid Form Title',
        description: 'A'.repeat(2025), // 2025 characters
      };

      if (!formSummaryConfig.parseConfigData) {
        expect.fail('formSummaryConfig.parseConfigData is undefined');
      }
      const result = formSummaryConfig.parseConfigData(data);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error.description).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });

  describe('formSummaryConfig', () => {
    it('should have correct initial values', () => {
      expect(formSummaryConfig.initial).toBeDefined();
      expect(formSummaryConfig.initial.title).toBe('Form title');
      expect(formSummaryConfig.initial.description).toBe('Form extended description');
    });

    it('should have an empty children array', () => {
      const pattern: FormSummaryPattern = {
        type: 'form-summary',
        id: 'test-form-summary',
        data: {
          title: 'Test Form Title',
          description: 'Test form description',
        },
      };
      
      const patterns = {} as Record<string, any>;
      const children = formSummaryConfig.getChildren(pattern, patterns);
      expect(children).toEqual([]);
    });

    it('should handle invalid config data', () => {
      const data = {
        title: '',
        description: '',
      };

      if (!formSummaryConfig.parseConfigData) {
        expect.fail('emailInputConfig.parseConfigData is undefined');
      }
      const result = formSummaryConfig.parseConfigData(data);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should create proper prompt with correct props', () => {
      const pattern: FormSummaryPattern = {
        type: 'form-summary',
        id: 'test-form-summary',
        data: {
          title: 'Test Form Title',
          description: 'Test form description',
        },
      };
      
      const session = {} as any; // Mock session
      const options = {} as any; // Mock options
      const formConfig = {} as any; // Mock FormConfig
      
      const prompt = formSummaryConfig.createPrompt(formConfig, session, pattern, options);
      
      expect(prompt).toBeDefined();
      expect(prompt.props).toBeDefined();
      expect(prompt.props._patternId).toBe('test-form-summary');
      expect(prompt.props.type).toBe('form-summary');
      
      const props = prompt.props as FormSummaryProps;
      expect(props.title).toBe('Test Form Title');
      expect(props.description).toBe('Test form description');
      expect(prompt.children).toEqual([]);
    });
  });
});
