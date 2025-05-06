import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type CheckboxGroupProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../types.js';
import classNames from 'classnames';

const CheckboxGroupPattern: PatternComponent<CheckboxGroupProps> = props => {
  const { register } = useFormContext();
  const hintId = `hint-${props.groupId}`;
  const errorId = `error-${props.groupId}`;

  return (
    <fieldset className="usa-fieldset padding-top-2">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': props.error,
        })}
      >
        <legend className="usa-legend text-bold margin-top-0">
          {props.label}
          {props.required && <span className="usa-required">*</span>}
        </legend>
        {props.hint && (
          <div className="usa-hint" id={hintId}>
            {props.hint}
          </div>
        )}
        {props.error && (
          <div className="usa-error-message" id={errorId}>
            {props.error.message}
          </div>
        )}
        {props.options.map((option, index) => {
          const inputId = `${props.groupId}-${option.id}`;
          return (
            <div key={index} className="usa-checkbox">
              <input
                id={`input-${inputId}`}
                type="checkbox"
                className="usa-checkbox__input"
                defaultChecked={option.defaultChecked}
                disabled={option.disabled}
                value={option.id}
                aria-describedby={`${props.hint ? hintId : ''} ${
                  props.error ? errorId : ''
                }`.trim()}
                {...register(`${props.groupId}.${option.id}`)}
              />
              <label
                className="usa-checkbox__label"
                htmlFor={`input-${inputId}`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default CheckboxGroupPattern;
