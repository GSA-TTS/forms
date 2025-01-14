import classNames from 'classnames';
import React from 'react';

import { type FormSummaryProps } from '@atj/forms';
import { type Pattern } from '@atj/forms';
import { type FormSummaryPattern } from '@atj/forms';

import FormSummary from '../../../Form/components/FormSummary/index.js';
import { PatternEditComponent } from '../types.js';

import { PatternEditForm } from './common/PatternEditForm.js';
import { usePatternEditFormContext } from './common/hooks.js';
import { PatternEditActions } from './common/PatternEditActions.js';

const FormSummaryEdit: PatternEditComponent<FormSummaryProps> = ({
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
        <div className="padding-left-3 padding-bottom-3 padding-right-3">
          <FormSummary context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: Pattern }) => {
  const patternId = pattern.id;
  const { getFieldState, fieldId, register } =
    usePatternEditFormContext<FormSummaryPattern>(patternId);
  const description = getFieldState('description');
  const title = getFieldState('title');

  return (
    <div className="grid-row grid-gap-1">
      <div className="desktop:grid-col-6 mobile:grid-col-12">
        <label
          className={classNames('usa-label', {
            'usa-label--error': title.error,
          })}
          htmlFor={fieldId('title')}
        >
          Title
          {title.error ? (
            <span className="usa-error-message" role="alert">
              {title.error.message}
            </span>
          ) : null}
          <input
            id={fieldId('title')}
            className="usa-input bg-primary-lighter text-bold"
            {...register('title')}
            defaultValue={pattern.data.title}
            type="text"
            autoFocus
          ></input>
        </label>
      </div>
      <div className="desktop:grid-col-6 mobile:grid-col-12">
        <label
          className={classNames('usa-label', {
            'usa-input--error': description.error,
          })}
          htmlFor={fieldId('description')}
        >
          Description
          {description.error ? (
            <span className="usa-error-message" role="alert">
              {description.error.message}
            </span>
          ) : null}
          <textarea
            id={fieldId('description')}
            className="usa-textarea bg-primary-lighter text-bold"
            {...register('description')}
            defaultValue={pattern.data.description}
          ></textarea>
        </label>
      </div>
      <div className="grid-col-12">
        <PatternEditActions />
      </div>
    </div>
  );
};

export default FormSummaryEdit;
