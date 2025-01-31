import classnames from 'classnames';
import React from 'react';

import { enLocale as message } from '@gsa-tts/forms-common';
import { type CheckboxProps } from '@gsa-tts/forms-core';
import { type CheckboxPattern } from '@gsa-tts/forms-core';

import Checkbox from '../../../../Form/components/Checkbox/index.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';

const CheckboxPatternEdit: PatternEditComponent<CheckboxProps> = ({
  context,
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<CheckboxEditComponent pattern={focus.pattern} />}
        ></PatternEditForm>
      ) : (
        <div className="padding-left-3 padding-bottom-3 padding-right-3">
          <Checkbox context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const CheckboxEditComponent = ({ pattern }: { pattern: CheckboxPattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<CheckboxPattern>(pattern.id);

  const label = getFieldState('label');

  return (
    <div className="grid-row grid-gap padding-3">
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        <label
          className={classnames('usa-label', {
            'usa-label--error': label.error,
          })}
          htmlFor={fieldId('label')}
        >
          {message.patterns.checkbox.fieldLabel}
        </label>
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
      </div>
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        <div className="usa-checkbox">
          <input
            id={fieldId('defaultChecked')}
            type="checkbox"
            {...register('defaultChecked')}
            className="usa-checkbox__input"
          />
          <label
            className="usa-checkbox__label"
            htmlFor={fieldId('defaultChecked')}
          >
            {message.patterns.checkbox.defaultFieldValue}
          </label>
        </div>
      </div>
      <div className="grid-col-12">
        <PatternEditActions />
      </div>
    </div>
  );
};

export default CheckboxPatternEdit;
