import { describe, expect, it } from 'vitest';
import { accordionRowConfig, type AccordionRowPattern } from './index.js';

describe('AccordionRowPattern tests', () => {
  describe('accordionRowConfig.parseConfigData', () => {
    it('should parse valid config data correctly', () => {
      const obj = {
        title: 'Test Accordion Row Title',
        text: 'Test Accordion Row Text',
        isOpen: true,
      };

      if (!accordionRowConfig.parseConfigData) {
        expect.fail('accordionRowConfig.parseConfigData is undefined');
      }
      const result = accordionRowConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.title).toBe('Test Accordion Row Title');
        expect(result.data.text).toBe('Test Accordion Row Text');
        expect(result.data.isOpen).toBe(true);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        title: '',
        text: '',
        isOpen: true,
      };

      const result = accordionRowConfig.parseConfigData(obj);

      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.error).toEqual(
          expect.objectContaining({
            text: {
              message: 'Text is required',
              type: 'required',
            },
            title: {
              message: 'Title is required',
              type: 'required',
            },
          })
        );
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
