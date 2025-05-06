import React, { useState } from 'react';
import classNames from 'classnames';
import { useFormContext, useWatch } from 'react-hook-form';
import { type GenderIdProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../types.js';

const GenderIdPattern: PatternComponent<GenderIdProps> = ({
  genderId,
  hint,
  label,
  required,
  error,
  value,
  preferNotToAnswerText,
  preferNotToAnswerChecked: initialPreferNotToAnswerChecked = false,
}) => {
  const { register, setValue } = useFormContext();
  const [preferNotToAnswerChecked, setPreferNotToAnswerChecked] = useState(
    initialPreferNotToAnswerChecked
  );

  const errorId = `input-error-message-${genderId}`;
  const hintId = `hint-${genderId}`;
  const preferNotToAnswerId = `${genderId}.preferNotToAnswer`;
  const inputId = `${genderId}.gender`;

  const watchedValue = useWatch({ name: inputId, defaultValue: value?.gender });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setPreferNotToAnswerChecked(isChecked);
    setValue(genderId, isChecked ? preferNotToAnswerText : value?.gender, {
      shouldValidate: true,
    });
  };

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
          htmlFor={genderId}
        >
          {label || 'Gender identity'}
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
        <input
          className={classNames('usa-input usa-input--xl', {
            'usa-input--error': error,
          })}
          id={inputId}
          type="text"
          readOnly={preferNotToAnswerChecked}
          disabled={preferNotToAnswerChecked}
          defaultValue={preferNotToAnswerChecked ? '' : watchedValue}
          {...register(inputId, { required })}
          aria-describedby={
            `${hint ? `${hintId}` : ''}${error ? ` ${errorId}` : ''}`.trim() ||
            undefined
          }
        />
        {preferNotToAnswerText && (
          <div className="usa-checkbox usa-input--xl">
            <input
              className="usa-checkbox__input"
              id={preferNotToAnswerId}
              type="checkbox"
              defaultValue={preferNotToAnswerText}
              defaultChecked={preferNotToAnswerChecked}
              {...register(preferNotToAnswerId)}
              onChange={handleCheckboxChange}
            />
            <label
              className="usa-checkbox__label"
              htmlFor={preferNotToAnswerId}
            >
              {preferNotToAnswerText}
            </label>
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default GenderIdPattern;
