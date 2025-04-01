import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { type TextAreaProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../../Form/index.js';

const TextArea: PatternComponent<TextAreaProps> = ({
  inputId,
  label,
  required,
  error,
  value,
  hint,
}) => {
  const { register } = useFormContext();
  const errorId = `input-error-message-${inputId}`;
  const hintId = `input-hint-${inputId}`;

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
          htmlFor={`textarea-${inputId}`}
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
        <textarea
          className={classNames('usa-textarea', {
            'usa-input--error': error,
          })}
          id={`textarea-${inputId}`}
          defaultValue={value}
          {...register(inputId, { required })}
          aria-describedby={
            `${hint ? `${hintId}` : ''}${error ? ` ${errorId}` : ''}`.trim() ||
            undefined
          }
          style={{ resize: 'none', overflow: 'auto', height: '100px' }}
        />
      </div>
    </fieldset>
  );
};

export default TextArea;
