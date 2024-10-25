import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type SelectProps } from '@atj/forms';

import { type PatternComponent } from '../../../Form/index.js';

export const SelectPattern: PatternComponent<SelectProps> = props => {
  const { register } = useFormContext();
  return (
    <div className="usa-fieldset padding-top-2">
      <legend className="usa-legend text-bold margin-top-0 padding-top-3">
        {props.legend}
      </legend>
      {props.options.map((option, index) => {
        return (
          <div key={index} className="usa-radio">
            <input
              className="usa-radio__input"
              type="radio"
              id={option.id}
              {...register(props.groupId)}
              value={option.id}
              defaultChecked={option.defaultChecked}
            />
            <label htmlFor={option.id} className="usa-radio__label">
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};
