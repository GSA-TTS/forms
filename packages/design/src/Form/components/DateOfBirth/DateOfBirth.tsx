import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type DateOfBirthProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../index.js';

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const getAriaDescribedBy = (
  errorId: string | null,
  hintId: string | null
): string | undefined => {
  const ids = [errorId, hintId].filter(Boolean).join(' ');
  return ids || undefined;
};

export const DateOfBirthPattern: PatternComponent<DateOfBirthProps> = ({
  monthId,
  dayId,
  yearId,
  label,
  hint,
  required,
  error,
  value,
}) => {
  const { register } = useFormContext();
  const errorId = `input-error-message-${monthId}`;
  const hintId = `hint-${monthId}`;

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
          htmlFor={monthId}
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
        <div className="usa-memorable-date">
          <div className="usa-form-group usa-form-group--month usa-form-group--select">
            <label className="usa-label" htmlFor={monthId}>
              Month
            </label>
            <select
              className={classNames('usa-input', {
                'usa-input--error': !!error,
              })}
              id={monthId}
              {...register(monthId)}
              defaultValue={value?.month}
              aria-describedby={
                getAriaDescribedBy(
                  error ? errorId : null,
                  hint ? hintId : null
                ) || undefined
              }
            >
              <option key="default" value="">
                - Select -
              </option>
              {months.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="usa-form-group usa-form-group--day">
            <label className="usa-label" htmlFor={dayId}>
              Day
            </label>
            <input
              className={classNames('usa-input', {
                'usa-input--error': !!error,
              })}
              id={dayId}
              {...register(dayId, { required })}
              minLength={2}
              maxLength={2}
              pattern="[0-9]*"
              inputMode="numeric"
              aria-describedby={getAriaDescribedBy(
                error ? `input-error-message-${dayId}` : null,
                hint ? hintId : null
              )}
              defaultValue={value?.day}
            />
          </div>
          <div className="usa-form-group usa-form-group--year">
            <label className="usa-label" htmlFor={yearId}>
              Year
            </label>
            <input
              className={classNames('usa-input', {
                'usa-input--error': !!error,
              })}
              id={yearId}
              {...register(yearId, { required })}
              minLength={4}
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
              aria-describedby={getAriaDescribedBy(
                error ? `input-error-message-${yearId}` : null,
                hint ? hintId : null
              )}
              defaultValue={value?.year}
            />
          </div>
        </div>
      </div>
    </fieldset>
  );
};
