import React from 'react';
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

  return (
    <fieldset className="usa-fieldset">
      <div className="usa-form-group">
        <label className="usa-label" htmlFor={emailId}>
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        <input
          className="usa-input margin-bottom-1"
          id={emailId}
          type="email"
          autoCapitalize="off"
          autoCorrect="off"
          {...register(emailId, { required })}
        />
      </div>
      {error && (
        <span className="error-message" style={{ color: 'red' }}>
          {error.message}
        </span>
      )}
    </fieldset>
  );
};
