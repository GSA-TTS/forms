import classNames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type TextInputProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../types.js';

const TextInput: PatternComponent<TextInputProps> = ({
  inputId,
  label,
  hint,
  required,
  error,
  value,
}) => {
  const { register } = useFormContext();
  const id = inputId;
  const errorId = `input-error-message-${inputId}`;
  const hintId = `hint-${inputId}`;

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
        {hint && (
          <div className="usa-hint" id={hintId}>
            {hint}
          </div>
        )}
        {error && (
          <div className="usa-error-message" id={errorId} role="alert">
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
          aria-describedby={
            `${hint ? `${hintId}` : ''}${error ? ` ${errorId}` : ''}`.trim() ||
            undefined
          }
        />
      </div>
    </fieldset>
  );
};

export default TextInput;
