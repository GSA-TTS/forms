import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type CheckboxProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../../Form/index.js';
import classNames from 'classnames';

export const CheckboxPattern: PatternComponent<CheckboxProps> = props => {
  const { register } = useFormContext();
  const hintId = `hint-${props.id}`;
  return (
    <div className="usa-checkbox">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': props.error,
        })}
      >
        <label className="usa-label">{props.label}</label>
        {props.hint && (
          <div className="usa-hint" id={hintId}>
            {props.hint}
          </div>
        )}

        {props.options.map((option, index) => {
          const id = option.id;
          return (
            <div key={index} className="usa-checkbox">
              <input
                className="usa-checkbox__input"
                type="checkbox"
                id={`input-${id}`}
                {...register(`${id}`)}
                value={id}
                defaultChecked={option.defaultChecked}
              />
              <label htmlFor={`input-${id}`} className="usa-checkbox__label">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
