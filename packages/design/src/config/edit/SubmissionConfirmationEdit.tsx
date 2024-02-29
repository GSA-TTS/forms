import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type InputElement } from '@atj/forms/src/config/elements/input';

import { FormElementEditComponent } from '..';

const InputElementEdit: FormElementEditComponent<InputElement> = ({
  element,
}) => {
  const { register } = useFormContext();
  return (
    <div className="grid-row grid-gap">
      <div className="grid-col grid-col-4">
        <label className="usa-label">
          Field label
          <input
            className="usa-input"
            {...register(`${element.id}.data.text`)}
            type="text"
          ></input>
        </label>
      </div>
      <div className="grid-col grid-col-2">
        <label className="usa-label">
          Default field value
          <input
            className="usa-input"
            type="text"
            {...register(`${element.id}.data.initial`)}
          ></input>
        </label>
      </div>
      <div className="grid-col grid-col-2">
        <label className="usa-label">
          Maximum length
          <input
            className="usa-input"
            type="text"
            {...register(`${element.id}.data.maxLength`)}
          ></input>
        </label>
      </div>
      <div className="grid-col grid-col-2">
        <label className="usa-label">
          Field type
          <select className="usa-select" {...register(`${element.id}.type`)}>
            <option value={'input'}>Input</option>
          </select>
        </label>
      </div>
      <div className="grid-col grid-col-2">
        <div className="usa-checkbox">
          <input
            className="usa-checkbox__input"
            type="checkbox"
            id={`${element.id}.required`}
            {...register(`${element.id}.data.required`)}
          />
          <label
            className="usa-checkbox__label"
            htmlFor={`${element.id}.data.required`}
          >
            Required
          </label>
        </div>
      </div>
    </div>
  );
};

export default InputElementEdit;