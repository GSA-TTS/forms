import classnames from 'classnames';
import React from 'react';

import { type EmailInputProps } from '@atj/forms';
import { type EmailInputPattern } from '@atj/forms';

import EmailInput from '../../../../Form/components/EmailInput/index.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@atj/common';
import styles from '../../formEditStyles.module.css';

const EmailInputEdit: PatternEditComponent<EmailInputProps> = ({
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
          className={`${styles.emailInputPattern} padding-left-3 padding-bottom-3 padding-right-3`}
        >
          <EmailInput context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: EmailInputPattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<EmailInputPattern>(pattern.id);
  const label = getFieldState('label');

  return (
    <div className="grid-row grid-gap">
      <div className="tablet:grid-col-12 mobile-lg:grid-col-12 margin-bottom-2">
        <label
          className={classnames('usa-label', {
            'usa-label--error': label.error,
          })}
        >
          {message.patterns.emailInput.fieldLabel}
          {label.error ? (
            <span className="usa-error-message" role="alert">
              {label.error.message}
            </span>
          ) : null}
          <input
            className="usa-input"
            id={fieldId('label')}
            defaultValue={pattern.data.label}
            {...register('label')}
            type="text"
            autoFocus
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

export default EmailInputEdit;
