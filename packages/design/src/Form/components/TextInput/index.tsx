import classNames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type TextInputProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../../Form/index.js';

const TextInput: PatternComponent<TextInputProps> = ({
  inputId,
  label,
  required,
  error,
  value,
}) => {
  console.log('TextInput', inputId, label, required, error, value);
  const { register } = useFormContext();
  const id = inputId;
  return (
    <fieldset className="usa-fieldset">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': error,
        })}
      >
        <label
          className={classNames('usa-label', {
            'usa-label--error': error,
          })}
          htmlFor={`input-${id}`}
        >
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        {error && (
          <div
            className="usa-error-message"
            id={`input-error-message-${id}`}
            role="alert"
          >
            {error.message}
          </div>
        )}
        <input
          className={classNames('usa-input', {
            'usa-input--error': error,
          })}
          id={`input-${id}`}
          defaultValue={value}
          {...register(id || Math.random().toString())}
          type="text"
          aria-describedby={`input-message-${id}`}
        />
      </div>
    </fieldset>
  );
};

export default TextInput;
