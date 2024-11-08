import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type SelectDropdownProps } from '@atj/forms';
import { type PatternComponent } from '../../index.js';

export const SelectDropdownPattern: PatternComponent<SelectDropdownProps> = ({
  selectId,
  label,
  required,
  options,
  error,
}) => {
  const { register } = useFormContext();
  return (
    <div className="usa-fieldset padding-top-2">
      <label className="usa-label" htmlFor={selectId}>
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <select className="usa-select" id={selectId} {...register(selectId)}>
        <option key="default" value="">
          - Select -
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="error-message" style={{ color: 'red' }}>
          {error.message}
        </span>
      )}
    </div>
  );
};
