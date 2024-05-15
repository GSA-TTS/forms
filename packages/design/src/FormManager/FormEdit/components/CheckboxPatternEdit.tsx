import classnames from 'classnames';
import React from 'react';

import { type CheckboxProps, type PatternId } from '@atj/forms';
import { type CheckboxPattern } from '@atj/forms/src/patterns/checkbox';

import Checkbox from '../../../Form/components/Checkbox';
import { useFormManagerStore } from '../../store';
import { PatternEditComponent } from '../types';

import { PatternEditActions } from './common/PatternEditActions';
import { PatternEditForm } from './common/PatternEditForm';
import { usePatternEditFormContext } from './common/hooks';

const CheckboxPatternEdit: PatternEditComponent<CheckboxProps> = ({
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<CheckboxEditComponent patternId={focus.pattern.id} />}
        ></PatternEditForm>
      ) : (
        <Checkbox {...previewProps} />
      )}
    </>
  );
};

const CheckboxEditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore(state => state.form.patterns[patternId]);
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<CheckboxPattern>(patternId);

  const label = getFieldState('label');

  return (
    <div className="grid-row grid-gap">
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        <label
          className={classnames('usa-label', {
            'usa-label--error': label.error,
          })}
          htmlFor={fieldId('label')}
        >
          Field label
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
            Default field value
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