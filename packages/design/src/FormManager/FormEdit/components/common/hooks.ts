import { useState, useEffect } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

import {
  type Pattern,
  type PatternId,
  type PatternMap,
  type PatternValue,
} from '@gsa-tts/forms-core';

export type Option = {
  id: string;
  label: string;
  [key: string]: string;
};

type UsePatternOptionsProps = {
  initialOptions: Option[];
  onOptionsChange?: (options: Option[]) => void;
  setValue?: (name: string, value: PatternValue) => void;
};

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

export const usePatternOptions = ({
  initialOptions,
  onOptionsChange,
  setValue,
}: UsePatternOptionsProps) => {
  const [options, setOptions] = useState<Option[]>(initialOptions);

  useEffect(() => {
    setValue?.('options', options);
    onOptionsChange?.(options);
  }, [options, setValue, onOptionsChange]);

  const deleteOption = (optionId: string) => {
    setOptions(options.filter(option => option.id !== optionId));
  };

  const updateOptionLabel = (index: number, value: string) => {
    const newOptions = [...options];
    if (newOptions[index]) {
      newOptions[index].label = value;
      setOptions(newOptions);
    }
  };

  return {
    options,
    setOptions,
    deleteOption,
    updateOptionLabel,
  };
};

export const createPatternOptionsWithContext = <T extends Pattern>(
  pattern: T,
  patternEditContext?: ReturnType<typeof usePatternEditFormContext<T>>
) => {
  const context =
    patternEditContext || usePatternEditFormContext<T>(pattern.id);

  return usePatternOptions({
    initialOptions: pattern.data.options || [],
    setValue: (name, value) =>
      context.setValue(name as NestedKeys<T['data']>, value),
  });
};

export default usePatternOptions;
