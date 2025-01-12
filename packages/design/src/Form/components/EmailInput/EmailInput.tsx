import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type EmailInputProps } from '@atj/forms';
import { type PatternComponent } from '../../index.js';

export const EmailInputPattern: PatternComponent<EmailInputProps> = ({
  emailId,
  label,
  required,
  error,
}) => {
  const { register } = useFormContext();
  const errorId = `input-error-message-${emailId}`;

  return (
    <fieldset className="usa-fieldset">
      <div className="usa-form-group">
        <label className="usa-label" htmlFor={emailId}>
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        {error && (
          <div className="usa-error-message" id={errorId} role="alert">
            {error.message}
          </div>
        )}
        <input
          className={classNames('usa-input margin-bottom-1', {
            'usa-input--error': error,
          })}
          id={emailId}
          type="email"
          autoCapitalize="off"
          autoCorrect="off"
          {...register(emailId, { required })}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
    </fieldset>
  );
};
