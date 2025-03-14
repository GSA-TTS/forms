import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type CheckboxProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../../Form/index.js';
import classNames from 'classnames';

export const CheckboxPattern: PatternComponent<CheckboxProps> = props => {
  const { register } = useFormContext();
  return (
    <div className="usa-checkbox">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': props.error,
        })}
      >
        <input
          id={props.id}
          type="checkbox"
          className="usa-checkbox__input"
          defaultChecked={props.defaultChecked}
          {...register(props.id)}
        />
        <label className="usa-checkbox__label" htmlFor={props.id}>
          {props.label}
        </label>
      </div>
    </div>
  );
};
