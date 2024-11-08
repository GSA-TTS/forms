import React from 'react';
import { useFormContext } from 'react-hook-form';
import { type DateOfBirthProps } from '@atj/forms';
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

export const DateOfBirthPattern: PatternComponent<DateOfBirthProps> = ({
  monthId,
  dayId,
  yearId,
  label,
  hint,
  required,
  error,
}) => {
  const { register } = useFormContext();

  return (
    <fieldset className="usa-fieldset">
      <legend className="usa-legend">
        {label}
        {required && <span className="required-indicator">*</span>}
      </legend>
      {hint && (
        <span className="usa-hint" id="mdHint">
          {hint}
        </span>
      )}
      <div className="usa-memorable-date">
        <div className="usa-form-group usa-form-group--month usa-form-group--select">
          <label className="usa-label" htmlFor={monthId}>
            Month
          </label>
          <select
            className="usa-select"
            id={monthId}
            {...register(monthId)}
            aria-describedby="mdHint"
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
            className="usa-input"
            aria-describedby="mdHint"
            id={dayId}
            {...register(dayId)}
            minLength={2}
            maxLength={2}
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
        <div className="usa-form-group usa-form-group--year">
          <label className="usa-label" htmlFor={yearId}>
            Year
          </label>
          <input
            className="usa-input"
            aria-describedby="mdHint"
            id={yearId}
            {...register(yearId)}
            minLength={4}
            maxLength={4}
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </div>
      </div>
      {error && (
        <span className="error-message" style={{ color: 'red' }}>
          {error.message}
        </span>
      )}
    </fieldset>
  );
};
