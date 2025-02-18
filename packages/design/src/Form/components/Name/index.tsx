import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type PatternComponent } from '../../index.js';
import { type NameProps } from '@gsa-tts/forms-core';

const getAriaDescribedBy = (
  errorId: string | null,
  hintId: string | null
): string | undefined => {
  const ids = [errorId, hintId].filter(Boolean).join(' ');
  return ids || undefined;
};

const NamePattern: PatternComponent<NameProps> = ({
  givenNameId,
  middleNameId,
  familyNameId,
  label,
  givenNameHint,
  familyNameHint,
  required,
  errors,
  values,
}) => {
  const { register } = useFormContext();
  const errorId = `input-error-message-${givenNameId}`;
  const givenNameHintId = `hint-${givenNameId}`;
  const familyNameHintId = `hint-${familyNameId}`;

  return (
    <fieldset className="usa-fieldset">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': errors,
        })}
      >
        <legend
          className={classNames('usa-legend text-bold', {
            'usa-legend--error': errors,
          })}
        >
          {label}
          {required && <span className="required-indicator">*</span>}
        </legend>
        {errors && (
          <div
            className="usa-error-message"
            id={'error-' + givenNameId}
            role="alert"
          >
            {errors.nameInput?.message}
          </div>
        )}

        <label className="usa-label" htmlFor={givenNameId}>
          First or given name
        </label>
        {givenNameHint && (
          <div className="usa-hint" id={givenNameHintId}>
            {givenNameHint}
          </div>
        )}
        {errors?.givenName && (
          <div className="usa-error-message" id={errorId}>
            {errors?.givenName.message}
          </div>
        )}
        <input
          className={classNames('usa-input usa-input--xl', {
            'usa-input--error': !!errors?.givenName,
          })}
          id={givenNameId}
          {...register(givenNameId, { required })}
          aria-describedby={getAriaDescribedBy(
            errors?.givenName ? errorId : null,
            givenNameHintId
          )}
          defaultValue={values?.givenName || ''}
        />

        <label className="usa-label" htmlFor={middleNameId}>
          Middle name
        </label>
        {errors?.middleName && (
          <div className="usa-error-message" id={errorId}>
            {errors?.middleName.message}
          </div>
        )}
        <input
          className="usa-input usa-input--xl"
          id={middleNameId}
          {...register(middleNameId)}
          defaultValue={values?.middleName || ''}
        />

        <label className="usa-label" htmlFor={familyNameId}>
          Last or family name
        </label>
        {familyNameHint && (
          <div className="usa-hint" id={familyNameHintId}>
            {familyNameHint}
          </div>
        )}
        {errors?.familyName && (
          <div className="usa-error-message" id={errorId}>
            {errors?.familyName.message}
          </div>
        )}
        <input
          className={classNames('usa-input usa-input--xl', {
            'usa-input--error': !!errors?.familyName,
          })}
          id={familyNameId}
          {...register(familyNameId, { required })}
          aria-describedby={getAriaDescribedBy(
            errors?.familyName ? `input-error-message-${familyNameId}` : null,
            familyNameHintId
          )}
          defaultValue={values?.familyName || ''}
        />
      </div>
    </fieldset>
  );
};

export default NamePattern;
