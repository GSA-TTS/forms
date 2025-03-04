import { RegisterOptions, useFormContext } from 'react-hook-form';

import {
  type Pattern,
  type PatternId,
  type PatternMap,
  type PatternValue,
} from '@gsa-tts/forms-core';

type NestedKeys<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeys<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

export const usePatternEditFormContext = <T extends Pattern>(
  patternId: PatternId
) => {
  const { formState, getFieldState, register, setValue } =
    useFormContext<PatternMap>();
  return {
    errors: formState.errors,
    fieldId: (path: NestedKeys<T['data']>) => `${patternId}.${path}`,
    register: (path: NestedKeys<T['data']>, options?: RegisterOptions) =>
      register(`${patternId}.${path}`, options),
    getFieldState: (path: NestedKeys<T['data']>) =>
      getFieldState(`${patternId}.${path}`, formState),
    setValue: (path: NestedKeys<T['data']>, value: PatternValue) =>
      setValue(`${patternId}.${path}`, value),
  };
};
