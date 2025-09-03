import React from 'react';

import {
  type PatternId,
  SubmissionConfirmationProps,
} from '@gsa-tts/forms-core';

import SubmissionConfirmation from '../../../Form/components/SubmissionConfirmation/SubmissionConfirmation.js';
import { PatternEditComponent } from '../types.js';

import { PatternEditForm } from './common/PatternEditForm.js';
import { usePatternEditFormContext } from './common/hooks.js';

const SubmissionConfirmationEdit: PatternEditComponent<
  SubmissionConfirmationProps
> = ({ context, focus, previewProps }) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent patternId={focus.pattern.id} />}
        ></PatternEditForm>
      ) : (
        <SubmissionConfirmation context={context} {...previewProps} />
      )}
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const { fieldId, register } = usePatternEditFormContext(patternId);
  return (
    <div className="grid-row grid-gap-1">
      <div className="desktop:grid-col-4 mobile:grid-col-12">
        <label className="usa-label" htmlFor={fieldId('text')}>
          Field label
          <input
            className="usa-input bg-primary-lighter text-bold"
            {...register('text')}
            id={fieldId('text')}
            type="text"
          ></input>
        </label>
      </div>
      <div className="desktop:grid-col-2 mobile:grid-col-12">
        <label className="usa-label" htmlFor={fieldId('initial')}>
          Default field value
          <input
            className="usa-input bg-primary-lighter text-bold"
            id={fieldId('initial')}
            type="text"
            {...register('initial')}
          ></input>
        </label>
      </div>
      <div className="desktop:grid-col-2 mobile:grid-col-12">
        <label className="usa-label" htmlFor={fieldId('maxLength')}>
          Maximum length
          <input
            className="usa-input bg-primary-lighter text-bold"
            id={fieldId('maxLength')}
            type="text"
            {...register('maxLength')}
          ></input>
        </label>
      </div>
      <div className="desktop:grid-col-2 mobile:grid-col-12">
        <label className="usa-label" htmlFor={fieldId('type')}>
          Field type
          <select
            className="usa-select bg-primary-lighter text-bold"
            id={fieldId('type')}
            {...register('type')}
          >
            <option value={'input'}>Input</option>
          </select>
        </label>
      </div>
      <div className="desktop:grid-col-2 mobile:grid-col-12">
        <div className="usa-checkbox">
          <input
            className="usa-checkbox__input bg-primary-lighter"
            type="checkbox"
            id={fieldId('required')}
            {...register('required')}
          />
          <label className="usa-checkbox__label" htmlFor={fieldId('required')}>
            Required
          </label>
        </div>
      </div>
    </div>
  );
};

export default SubmissionConfirmationEdit;
