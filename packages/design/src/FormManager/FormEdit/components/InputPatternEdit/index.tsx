import classNames from 'classnames';
import React from 'react';

import { PatternId, TextInputProps } from '@gsa-tts/forms-core';
import { InputPattern } from '@gsa-tts/forms-core';

import TextInput from '../../../../Form/components/TextInput/index.js';
import { useFormManagerStore } from '../../../store.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';

const InputPatternEdit: PatternEditComponent<TextInputProps> = ({
  context,
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent patternId={focus.pattern.id} />}
        ></PatternEditForm>
      ) : (
        <div className="padding-left-3 padding-bottom-3 padding-right-3">
          <TextInput context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore<InputPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, register, getFieldState } =
    usePatternEditFormContext<InputPattern>(patternId);

  const initial = getFieldState('initial');
  const label = getFieldState('label');
  const maxLength = getFieldState('maxLength');

  const maxLengthAttributes =
    pattern.data.maxLength > 0
      ? {
          defaultValue: pattern.data.maxLength,
        }
      : {};

  return (
    <div className="grid-row grid-gap-1">
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        <label
          className={classNames('usa-label', {
            'usa-label--error': label.error,
          })}
          htmlFor={fieldId('label')}
        >
          {message.patterns.input.fieldLabel}
          {label.error ? (
            <span className="usa-error-message" role="alert">
              {label.error.message}
            </span>
          ) : null}
          <input
            className={classNames('usa-input bg-primary-lighter text-bold', {
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
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12 ohio">
        <label
          className={classNames('usa-label', {
            'usa-label--error': initial.error,
          })}
          htmlFor={fieldId('initial')}
        >
          {initial.error ? (
            <span className="usa-error-message" role="alert">
              {initial.error.message}
            </span>
          ) : null}
          {message.patterns.input.defaultFieldValue}
          <input
            className="usa-input bg-primary-lighter text-bold"
            id={fieldId('initial')}
            type="text"
            defaultValue={pattern.data.initial}
            {...register('initial')}
          ></input>
        </label>
      </div>
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        <label
          className={classNames('usa-label', {
            'usa-label--error': maxLength.error,
          })}
          htmlFor={fieldId('maxLength')}
        >
          {maxLength.error ? (
            <span className="usa-error-message" role="alert">
              {maxLength.error.message}
            </span>
          ) : null}
          {message.patterns.input.maxLength}
          <input
            className="usa-input bg-primary-lighter text-bold"
            id={fieldId('maxLength')}
            {...maxLengthAttributes}
            type="text"
            {...register('maxLength')}
          ></input>
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

export default InputPatternEdit;
