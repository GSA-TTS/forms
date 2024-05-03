import React, { useState } from 'react';

import { type RadioGroupProps } from '@atj/forms';

import RadioGroup from '../../../Form/components/RadioGroup';
import { PatternEditComponent } from '../types';

import { PatternEditActions } from './common/PatternEditActions';
import {
  PatternEditForm,
  usePatternEditFormContext,
} from './common/PatternEditForm';
import { type RadioGroupPattern } from '@atj/forms/src/patterns/radio-group';

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
        <RadioGroup {...previewProps} />
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: RadioGroupPattern }) => {
  const {
    register,
    formState: { errors },
  } = usePatternEditFormContext();
  const [options, setOptions] = useState(pattern.data.options);
  console.log(errors);
  return (
    <div className="grid-row grid-gap">
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        <label className="usa-label" htmlFor={`${pattern.id}.data.label`}>
          Radio group label
        </label>
        <input
          className="usa-input"
          id={`${pattern.id}.data.label`}
          defaultValue={`${pattern.id}`}
          {...register(`${pattern.id}.data.label`)}
          type="text"
        ></input>
      </div>
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        {options.map((option, index) => (
          <div key={index} className="display-flex">
            <input
              className="usa-input"
              id={`${pattern.id}.data.options.${index}.id`}
              {...register(`${pattern.id}.data.options.${index}.id`)}
            />
            <input
              className="usa-input"
              id={`${pattern.id}.data.options.${index}.label`}
              {...register(`${pattern.id}.data.options.${index}.label`)}
            />
          </div>
        ))}
        <button
          className="usa-button usa-button--outline"
          onClick={event => {
            event.preventDefault();
            const optionId = `${options.length + 1}`;
            setOptions(options.concat({ id: optionId, label: optionId }));
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
              className="usa-checkbox__input"
              type="checkbox"
              id={`${pattern.id}.data.required`}
              {...register(`${pattern.id}.data.required`)}
            />
            <label
              style={{ display: 'inline-block' }}
              className="usa-checkbox__label"
              htmlFor={`${pattern.id}.data.required`}
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
