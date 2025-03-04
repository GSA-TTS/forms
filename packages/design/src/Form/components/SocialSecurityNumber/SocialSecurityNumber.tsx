import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type SocialSecurityNumberProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../index.js';

const formatSSN = (value: string) => {
  const rawValue = value.replace(/[^\d]/g, '');
  if (rawValue.length <= 3) return rawValue;
  if (rawValue.length <= 5)
    return `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
  return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 5)}-${rawValue.slice(5, 9)}`;
};

export const SocialSecurityNumberPattern: PatternComponent<
  SocialSecurityNumberProps
> = ({ ssnId, hint, label, required, error, value }) => {
  const { register, setValue } = useFormContext();
  const errorId = `input-error-message-${ssnId}`;
  const hintId = `hint-${ssnId}`;

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedSSN = formatSSN(e.target.value);
    setValue(ssnId, formattedSSN, { shouldValidate: true });
  };

  return (
    <fieldset className="usa-fieldset">
      <div className={classNames('usa-form-group margin-top-2')}>
        <label
          className={classNames('usa-label', {
            'usa-label--error': error,
          })}
          htmlFor={ssnId}
        >
          {label || 'Social Security number'}
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
          className={classNames('usa-input usa-input--xl', {
            'usa-input--error': error,
          })}
          id={ssnId}
          type="text"
          defaultValue={value}
          {...register(ssnId, { required })}
          onChange={handleSSNChange}
          aria-describedby={
            `${hint ? `${hintId}` : ''}${error ? ` ${errorId}` : ''}`.trim() ||
            undefined
          }
        />
      </div>
    </fieldset>
  );
};
