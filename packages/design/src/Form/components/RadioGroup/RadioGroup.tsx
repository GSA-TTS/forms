import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type RadioGroupProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../../Form/index.js';
import classNames from 'classnames';

export const RadioGroupPattern: PatternComponent<RadioGroupProps> = props => {
  const { register } = useFormContext();
  const hintId = `hint-${props.groupId}`;
  return (
    <div className="usa-fieldset padding-top-2">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': props.error,
        })}
      >
        <legend className="usa-legend text-bold margin-top-0">
          {props.legend}
          {props.required && <span className="usa-required">*</span>}
        </legend>
        {props.hint && (
          <div className="usa-hint" id={hintId}>
            {props.hint}
          </div>
        )}
        {props.error && (
          <div className="usa-error-message" id={`error-${props.groupId}`}>
            {props.error.message}
          </div>
        )}
        {props.options.map((option, index) => {
          const id = option.id;
          return (
            <div key={index} className="usa-radio">
              <input
                className="usa-radio__input"
                type="radio"
                id={`input-${id}`}
                {...register(`${props.groupId}`)}
                value={option.id}
                defaultChecked={option.defaultChecked}
              />
              <label htmlFor={`input-${id}`} className="usa-radio__label">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
