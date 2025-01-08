import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type PhoneNumberProps } from '@atj/forms';
import { type PatternComponent } from '../../index.js';

const formatPhoneNumber = (value: string) => {
  const rawValue = value.replace(/[^\d]/g, ''); // Remove non-digit characters

  if (rawValue.length <= 3) return rawValue;
  if (rawValue.length <= 6)
    return `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
  return `${rawValue.slice(0, 3)}-${rawValue.slice(3, 6)}-${rawValue.slice(6, 10)}`;
};

export const PhoneNumberPattern: PatternComponent<PhoneNumberProps> = ({
  phoneId,
  hint,
  label,
  required,
  error,
  value,
}) => {
  const { register, setValue } = useFormContext();
  const errorId = `input-error-message-${phoneId}`;
  const hintId = `hint-${phoneId}`;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setValue(phoneId, formattedPhone, { shouldValidate: true });
  };

  return (
    <fieldset className="usa-fieldset">
      <div className={classNames('usa-form-group margin-top-2')}>
        <label
          className={classNames('usa-label', {
            'usa-label--error': error,
          })}
          htmlFor={phoneId}
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
          className={classNames('usa-input usa-input--xl', {
            'usa-input--error': error,
          })}
          id={phoneId}
          type="text"
          defaultValue={value}
          {...register(phoneId, { required })}
          onChange={handlePhoneChange}
          aria-describedby={
            `${hint ? `${hintId}` : ''}${error ? ` ${errorId}` : ''}`.trim() ||
            undefined
          }
        />
      </div>
    </fieldset>
  );
};
