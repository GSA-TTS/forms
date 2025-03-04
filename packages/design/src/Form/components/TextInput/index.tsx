import classNames from 'classnames';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type TextInputProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../../Form/index.js';

const TextInput: PatternComponent<TextInputProps> = props => {
  const { register } = useFormContext();
  const id = props.inputId;
  return (
    <div className="usa-form-group-wrapper" key={props.inputId}>
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': props.error,
        })}
      >
        <label
          className={classNames('usa-label', {
            'usa-label--error': props.error,
          })}
          id={`input-message-${id}`}
        >
          {props.label}
          {props.error && (
            <span
              className="usa-error-message"
              id={`input-error-message-${id}`}
              role="alert"
            >
              {props.error.message}
            </span>
          )}
          <input
            className={classNames('usa-input', {
              'usa-input--error': props.error,
            })}
            id={`input-${id}`}
            defaultValue={props.value}
            {...register(id || Math.random().toString(), {
              //required: props.required,
            })}
            type="text"
            aria-describedby={`input-message-${id}`}
          />
        </label>
      </div>
    </div>
  );
};

export default TextInput;
