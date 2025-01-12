import classnames from 'classnames';
import React, { useState } from 'react';

import { type RadioGroupProps } from '@atj/forms';
import { type RadioGroupPattern } from '@atj/forms';

import RadioGroup from '../../../../Form/components/RadioGroup/index.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@atj/common';
import styles from '../../formEditStyles.module.css';

const RadioGroupPatternEdit: PatternEditComponent<RadioGroupProps> = ({
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
          className={`${styles.radioFormPattern} padding-left-3 padding-bottom-3 padding-right-3`}
        >
          <RadioGroup {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: RadioGroupPattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<RadioGroupPattern>(pattern.id);
  const [options, setOptions] = useState(pattern.data.options);
  const label = getFieldState('label');

  return (
    <div className="grid-row grid-gap">
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12 margin-bottom-2">
        <label
          className={classnames('usa-label', {
            'usa-label--error': label.error,
          })}
        >
          {message.patterns.radioGroup.fieldLabel}
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
          ></input>
        </label>
      </div>
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        {options.map((option, index) => {
          const optionId = getFieldState(`options.${index}.id`);
          const optionLabel = getFieldState(`options.${index}.label`);
          return (
            <div key={index}>
              {optionId.error ? (
                <span className="usa-error-message" role="alert">
                  {optionId.error.message}
                </span>
              ) : null}
              {optionLabel.error ? (
                <span className="usa-error-message" role="alert">
                  {optionLabel.error.message}
                </span>
              ) : null}
              <div className="display-flex margin-bottom-2">
                <input
                  className={classnames('hide', 'usa-input', {
                    'usa-label--error': label.error,
                  })}
                  id={fieldId(`options.${index}.id`)}
                  {...register(`options.${index}.id`)}
                  defaultValue={option.id}
                  aria-label={`Option ${index + 1} id`}
                />
                <input
                  className="usa-input"
                  id={fieldId(`options.${index}.label`)}
                  {...register(`options.${index}.label`)}
                  defaultValue={option.label}
                  aria-label={`Option ${index + 1} label`}
                />
              </div>
            </div>
          );
        })}
        <button
          className="usa-button usa-button--outline margin-top-1"
          type="button"
          onClick={event => {
            event.preventDefault();
            const optionId = `option-${options.length + 1}`;
            setOptions(options.concat({ id: optionId, label: optionId }));
          }}
        >
          Add new
        </button>
      </div>
      <div className="grid-col-12">
        <PatternEditActions />
      </div>
    </div>
  );
};

export default RadioGroupPatternEdit;
