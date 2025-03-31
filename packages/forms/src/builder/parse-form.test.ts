import { describe, it, expect } from 'vitest';
import { failure, success } from '@gsa-tts/forms-common';

import { parseForm, parseFormString } from './parse-form';
import { defaultFormConfig, type InputPattern } from '../patterns';
import type { Blueprint } from '../types';

describe('parseForm', () => {
  it('should return success when form data is valid', () => {
    const formData: Blueprint = {
      summary: {
        title: 'Test Title',
        description: 'Test Description',
      },
      root: 'rootValue',
      patterns: {
        validPattern: {
          type: 'input',
          id: 'validPattern',
          data: {
            label: 'label',
            required: true,
            hint: '',
          },
        } satisfies InputPattern,
      },
      outputs: [
        {
          id: 'output1',
          path: 'path/to/output',
          fields: {
            field1: {
              type: 'TextField',
              name: 'name',
              label: 'label',
              value: 'value',
              required: true,
            },
          },
          formFields: {
            formField1: 'formValue1',
          },
        },
      ],
    };

    const result = parseForm(defaultFormConfig, formData);
    expect(result).toEqual(success(formData));
  });

  it('should return failure when form data is invalid', () => {
    const formData = {
      summary: {
        title: 'Test Title',
        description: 'Test Description',
      },
      root: 'rootValue',
      patterns: {
        invalidPattern: {
          type: 'invalidPattern',
          data: {},
        },
      },
      outputs: [
        {
          id: 'output1',
          path: 'path/to/output',
          fields: {
            field1: 'value1',
          },
          formFields: {
            formField1: 'formValue1',
          },
        },
      ],
    };

    const result = parseForm(defaultFormConfig, formData);
    expect(result.success).toEqual(false);
  });
});

describe('parseFormString', () => {
  it('should return success when JSON string is valid', () => {
    const jsonString = JSON.stringify({
      summary: {
        title: 'Test Title',
        description: 'Test Description',
      },
      root: 'rootValue',
      patterns: {
        validPattern: {
          type: 'input',
          id: 'validPattern',
          data: {
            label: 'label',
            required: true,
            hint: '',
            initial: '',
          },
        } satisfies InputPattern,
      },
      outputs: [],
    } satisfies Blueprint);

    const result = parseFormString(defaultFormConfig, jsonString);
    expect(result).toEqual(success(JSON.parse(jsonString)));
  });

  it('should return failure when JSON string is invalid', () => {
    const jsonString = JSON.stringify({
      summary: {
        title: 'Test Title',
        description: 'Test Description',
      },
      root: 'rootValue',
      patterns: {
        invalidPattern: {
          type: 'invalidPattern',
          data: {},
        },
      },
      outputs: [
        {
          id: 'output1',
          path: 'path/to/output',
          fields: {
            field1: 'value1',
          },
          formFields: {
            formField1: 'formValue1',
          },
        },
      ],
    });

    const result = parseFormString(defaultFormConfig, jsonString);
    expect(result).toEqual({
      success: false,
      error:
        '[\n' +
        '  {\n' +
        '    "code": "custom",\n' +
        '    "message": "Invalid pattern",\n' +
        '    "path": [\n' +
        '      "patterns",\n' +
        '      "invalidPattern"\n' +
        '    ]\n' +
        '  }\n' +
        ']',
    });
  });
});
