import classNames from 'classnames';
import React from 'react';

import { PatternId, TextAreaProps } from '@atj/forms';
import { TextAreaPattern } from '@atj/forms';

import TextArea from '../../../../Form/components/TextArea/index.js';
import { useFormManagerStore } from '../../../store.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@atj/common';

const TextAreaPatternEdit: PatternEditComponent<TextAreaProps> = ({
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
          <TextArea context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore<TextAreaPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, register, getFieldState } =
    usePatternEditFormContext<TextAreaPattern>(patternId);

  const label = getFieldState('label');
  const maxLength = getFieldState('maxLength');
  const hint = getFieldState('hint');
  const maxLengthAttributes =
    pattern.data.maxLength > 0
      ? {
          defaultValue: pattern.data.maxLength,
        }
      : {};

  return (
    <div className="grid-row grid-gap-1">
      <div className="tablet:grid-col-12 mobile-lg:grid-col-12">
        <label
          className={classNames('usa-label', {
            'usa-label--error': label.error,
          })}
          htmlFor={fieldId('label')}
        >
          {message.patterns.textarea.fieldLabel}
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
            'usa-label--error': hint.error,
          })}
        >
          {message.patterns.textarea.hintLabel}
          {hint.error ? (
            <span className="usa-error-message" role="alert">
              {hint.error.message}
            </span>
          ) : null}
          <input
            className="usa-input"
            id={fieldId('hint')}
            defaultValue={pattern.data.hint}
            {...register('hint')}
            type="text"
          />
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
          {message.patterns.textarea.maxLength}
          <input
            className="usa-input bg-primary-lighter text-bold"
            id={fieldId('maxLength')}
            {...maxLengthAttributes}
            {...register('maxLength')}
            type="text"
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

export default TextAreaPatternEdit;
