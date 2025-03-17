import classnames from 'classnames';
import React, { useState } from 'react';

import { type RadioGroupProps } from '@gsa-tts/forms-core';
import { type RadioGroupPattern } from '@gsa-tts/forms-core';

import RadioGroup from '../../../../Form/components/RadioGroup/index.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import styles from '../../formEditStyles.module.css';

const RadioGroupPatternEdit: PatternEditComponent<RadioGroupProps> = ({
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
          className={`${styles.radioFormPattern} padding-left-3 padding-bottom-3 padding-right-3`}
        >
          <RadioGroup context={context} {...previewProps} />
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
  const hint = getFieldState('hint');

  return (
    <div className="grid-row grid-gap">
      <div className="mobile-lg:grid-col-12 margin-bottom-2">
        <label
          className={classnames('usa-label', {
            'usa-label--error': label.error,
          }, `${styles.patternChoiceFieldWrapper}`)}
          htmlFor={fieldId('label')}
        >
          {message.patterns.radioGroup.fieldLabel}
          {label.error ? (
            <span className="usa-error-message" role="alert">
              {label.error.message}
            </span>
          ) : null}
          <input
            className={`usa-input ${styles.patternChoiceFieldWrapper}`}
            id={fieldId('label')}
            defaultValue={pattern.data.label}
            {...register('label')}
            type="text"
            autoFocus
          ></input>
        </label>
      </div>
      <div className="mobile-lg:grid-col-12 margin-bottom-2">
        <label
          className={classnames(
            'usa-label',
            {
              'usa-label--error': hint.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
          htmlFor={fieldId('hint')}
        >
          <span className={`${styles.secondaryColor}`}>
            {message.patterns.radioGroup.hintLabel}
          </span>
          {hint.error ? (
            <span className="usa-error-message" role="alert">
              {hint.error.message}
            </span>
          ) : null}
          <input
            className={`usa-input ${styles.patternChoiceFieldWrapper}`}
            id={fieldId('hint')}
            defaultValue={pattern.data.hint}
            {...register('hint')}
            type="text"
          />
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
                <label
                  htmlFor={`options-${index}.id`}
                  className={`usa-radio__label ${styles.optionCircle}`}
                ></label>
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
          className={`usa-link ${styles.addMorePatternButton}`}
          type="button"
          onClick={event => {
            event.preventDefault();
            const optionId = `option-${options.length + 1}`;
            setOptions(options.concat({ id: optionId, label: `Option ${options.length + 1}`}));
          }}
        >
          Add option
        </button>
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

export default RadioGroupPatternEdit;
