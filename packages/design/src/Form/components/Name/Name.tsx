import React from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type PatternComponent } from '../../types.js';
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
  error,
  value,
}) => {
  const fieldErrors = error?.fields;
  const { register } = useFormContext();
  const errorId = `input-error-message-${givenNameId}`;
  const givenNameHintId = `hint-${givenNameId}`;
  const familyNameHintId = `hint-${familyNameId}`;

  return (
    <fieldset className="usa-fieldset">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': fieldErrors,
        })}
      >
        <legend
          className={classNames('usa-legend text-bold', {
            'usa-legend--error': fieldErrors,
          })}
        >
          {label}
          {required && <span className="required-indicator">*</span>}
        </legend>
        {fieldErrors && (
          <div
            className="usa-error-message"
            id={'error-' + givenNameId}
            role="alert"
          >
            {error?.message}
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
        {fieldErrors?.givenName && (
          <div className="usa-error-message" id={errorId}>
            {fieldErrors?.givenName.message}
          </div>
        )}
        <input
          className={classNames('usa-input usa-input--xl', {
            'usa-input--error': !!fieldErrors?.givenName,
          })}
          id={givenNameId}
          {...register(givenNameId, { required })}
          aria-describedby={getAriaDescribedBy(
            fieldErrors?.givenName ? errorId : null,
            givenNameHintId
          )}
          defaultValue={value?.givenName || ''}
        />

        <label className="usa-label" htmlFor={middleNameId}>
          Middle name
        </label>
        {fieldErrors?.middleName && (
          <div className="usa-error-message" id={errorId}>
            {fieldErrors?.middleName.message}
          </div>
        )}
        <input
          className="usa-input usa-input--xl"
          id={middleNameId}
          {...register(middleNameId)}
          defaultValue={value?.middleName || ''}
        />

        <label className="usa-label" htmlFor={familyNameId}>
          Last or family name
        </label>
        {familyNameHint && (
          <div className="usa-hint" id={familyNameHintId}>
            {familyNameHint}
          </div>
        )}
        {fieldErrors?.familyName && (
          <div className="usa-error-message" id={errorId}>
            {fieldErrors?.familyName.message}
          </div>
        )}
        <input
          className={classNames('usa-input usa-input--xl', {
            'usa-input--error': !!fieldErrors?.familyName,
          })}
          id={familyNameId}
          {...register(familyNameId, { required })}
          aria-describedby={getAriaDescribedBy(
            fieldErrors?.familyName
              ? `input-error-message-${familyNameId}`
              : null,
            familyNameHintId
          )}
          defaultValue={value?.familyName || ''}
        />
      </div>
    </fieldset>
  );
};

export default NamePattern;
