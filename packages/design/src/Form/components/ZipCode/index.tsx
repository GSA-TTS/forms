import React from 'react';
import { useFormContext } from 'react-hook-form';

import { type ZipcodeProps } from '@gsa-tts/forms-core';

export const ZipCode = (props: ZipcodeProps) => {
  const { register } = useFormContext();
  return (
    <>
      <label className="usa-label" htmlFor="zip">
        ZIP code
      </label>
      <input
        className="usa-input usa-input--medium"
        id={`input-${props.inputId}`}
        defaultValue={props.value}
        {...register(props.inputId, {
          //required: props.required,
        })}
        pattern="[\d]{5}(-[\d]{4})?"
      />
    </>
  );
};
