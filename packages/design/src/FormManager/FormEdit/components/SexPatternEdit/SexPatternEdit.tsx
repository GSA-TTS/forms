import classNames from 'classnames';
import React from 'react';

import { type SexProps, type SexPattern } from '@gsa-tts/forms-core';

import Sex from '../../../../Form/components/Sex/Sex.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import styles from '../../formEditStyles.module.css';

const SexPatternEdit: PatternEditComponent<SexProps> = ({
  context,
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent pattern={focus.pattern} />}
        ></PatternEditForm>
      ) : (
        <div
          className={`${styles.sexPattern} padding-left-3 padding-bottom-3 padding-right-3`}
        >
          <Sex context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: SexPattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<SexPattern>(pattern.id);
  const label = getFieldState('label');
  const helperText = getFieldState('helperText');

  return (
    <div className="grid-row grid-gap">
      <div className="grid-col-12 margin-bottom-2">
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': label.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
        >
          {message.patterns.sex.fieldLabel}
          {label.error ? (
            <span className="usa-error-message" role="alert">
              {label.error.message}
            </span>
          ) : null}
          <input
            className={classNames(
              'usa-input bg-primary-lighter',
              {
                'usa-input--error': label.error,
              },
              `${styles.patternChoiceFieldWrapper}`
            )}
            id={fieldId('label')}
            defaultValue={pattern.data.label}
            {...register('label')}
            type="text"
            autoFocus
          />
        </label>
      </div>
      <div className="grid-col-12 margin-bottom-2">
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': helperText.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
        >
          {message.patterns.sex.helperTextLabel}
          {helperText.error ? (
            <span className="usa-error-message" role="alert">
              {helperText.error.message}
            </span>
          ) : null}
          <textarea
            className={classNames(
              'usa-input bg-primary-lighter',
              {
                'usa-input--error': helperText.error,
              },
              `${styles.patternChoiceFieldWrapper}`
            )}
            id={fieldId('helperText')}
            defaultValue={pattern.data.helperText}
            {...register('helperText')}
            style={{ resize: 'none', overflow: 'auto', height: '100px' }}
          />
        </label>
      </div>
      <div className="grid-col-12">
        <PatternEditActions>
          <span className="usa-checkbox">
            <input
              style={{ display: 'inline-block' }}
              className="usa-checkbox__input bg-primary-lighter"
              type="checkbox"
              id={fieldId('required')}
              {...register('required')}
              defaultChecked={pattern.data.required}
            />
            <label
              style={{ display: 'inline-block' }}
              className="usa-checkbox__label"
              htmlFor={fieldId('required')}
            >
              Required
            </label>
          </span>
        </PatternEditActions>
      </div>
    </div>
  );
};

export default SexPatternEdit;
