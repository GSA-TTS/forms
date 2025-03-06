import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type SelectDropdownProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../index.js';

export const SelectDropdownPattern: PatternComponent<SelectDropdownProps> = ({
  selectId,
  label,
  required,
  options,
  error,
}) => {
  const { register } = useFormContext();
  const errorId = `input-error-message-${selectId}`;

  return (
    <div className="usa-fieldset padding-top-2">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': error,
        })}
      >
        <label
          className={classNames('usa-label', {
            'usa-label--error': error,
          })}
          htmlFor={selectId}
        >
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        {error && (
          <div className="usa-error-message" id={errorId} role="alert">
            {error.message}
          </div>
        )}
        <select
          className={classNames('usa-input', {
            'usa-input--error': error,
          })}
          id={selectId}
          {...register(selectId, { required })}
          aria-describedby={error ? errorId : undefined}
        >
          <option key="default" value="">
            - Select -
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
