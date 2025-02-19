import classNames from 'classnames';
import React from 'react';

import { type NameProps } from '@gsa-tts/forms-core';
import { type NamePattern } from '@gsa-tts/forms-core';

import { PatternEditComponent } from '../../types.js';
import Name from '../../../../Form/components/Name/index.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import styles from '../../formEditStyles.module.css';

const NamePatternEdit: PatternEditComponent<NameProps> = ({
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
          className={`${styles.namePattern} padding-left-3 padding-bottom-3 padding-right-3`}
        >
          <Name context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: NamePattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<NamePattern>(pattern.id);
  const label = getFieldState('label');
  const givenNameHint = getFieldState('givenNameHint');
  const familyNameHint = getFieldState('familyNameHint');

  return (
    <div className="grid-row grid-gap-1">
      <div className="tablet:grid-col-12 mobile-lg:grid-col-12">
        <label
          className={classNames('usa-label', {
            'usa-label--error': label.error,
          })}
          htmlFor={fieldId('label')}
        >
          {message.patterns.nameInput.fieldLabel}
          {label.error ? (
            <span className="usa-error-message" role="alert">
              {label.error.message}
            </span>
          ) : null}
          <input
            className={classNames('usa-input bg-primary-lighter', {
              'usa-input--error': label.error,
            })}
            id={fieldId('label')}
            defaultValue={pattern.data.label}
            {...register('label')}
            type="text"
            autoFocus
          ></input>
        </label>
      </div>
      <div className="tablet:grid-col-12 mobile-lg:grid-col-12 margin-bottom-2">
        <label
          className={classNames('usa-label', {
            'usa-label--error': givenNameHint.error,
          })}
        >
          {message.patterns.nameInput.givenNameHint}
          {givenNameHint.error ? (
            <span className="usa-error-message" role="alert">
              {givenNameHint.error.message}
            </span>
          ) : null}
          <input
            className="usa-input"
            id={fieldId('givenNameHint')}
            defaultValue={pattern.data.givenNameHint}
            {...register('givenNameHint')}
            type="text"
          />
        </label>
      </div>
      <div className="tablet:grid-col-12 mobile-lg:grid-col-12 margin-bottom-2">
        <label
          className={classNames('usa-label', {
            'usa-label--error': familyNameHint.error,
          })}
        >
          {message.patterns.nameInput.familyNameHint}
          {familyNameHint.error ? (
            <span className="usa-error-message" role="alert">
              {familyNameHint.error.message}
            </span>
          ) : null}
          <input
            className="usa-input"
            id={fieldId('familyNameHint')}
            defaultValue={pattern.data.familyNameHint}
            {...register('familyNameHint')}
            type="text"
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
export default NamePatternEdit;
