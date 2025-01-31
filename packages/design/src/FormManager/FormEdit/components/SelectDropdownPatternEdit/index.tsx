import classnames from 'classnames';
import React, { useState } from 'react';

import { type SelectDropdownProps } from '@gsa-tts/forms-core';
import { type SelectDropdownPattern } from '@gsa-tts/forms-core';

import SelectDropdown from '../../../../Form/components/SelectDropdown/index.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import styles from '../../formEditStyles.module.css';

const SelectDropdownPatternEdit: PatternEditComponent<SelectDropdownProps> = ({
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
          // TODO: update styles for select if available
          className={`${styles.radioFormPattern} padding-left-3 padding-bottom-3 padding-right-3`}
        >
          <SelectDropdown context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: SelectDropdownPattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<SelectDropdownPattern>(pattern.id);
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
          {message.patterns.selectDropdown.fieldLabel}
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
          const optionValue = getFieldState(`options.${index}.value`);
          const optionLabel = getFieldState(`options.${index}.label`);
          return (
            <div key={index}>
              {optionValue.error ? (
                <span className="usa-error-message" role="alert">
                  {optionValue.error.message}
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
                  id={fieldId(`options.${index}.value`)}
                  {...register(`options.${index}.value`)}
                  defaultValue={option.value}
                  aria-label={`Option ${index + 1} value`}
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
            const optionValue = `value-${options.length + 1}`;
            setOptions(options.concat({ value: optionValue, label: optionId }));
          }}
        >
          Add new
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

export default SelectDropdownPatternEdit;
