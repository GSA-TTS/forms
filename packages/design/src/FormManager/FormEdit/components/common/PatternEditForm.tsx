import React, { useEffect } from 'react';
import { type ErrorOption, FormProvider, useForm } from 'react-hook-form';

import { type FormError, type Pattern, type PatternMap } from '@atj/forms';

import { useFormManagerStore } from '../../../store';

type PatternEditFormProps = {
  pattern: Pattern;
  editComponent: React.ReactNode;
};

export const PatternEditForm = ({
  pattern,
  editComponent,
}: PatternEditFormProps) => {
  const updateActivePattern = useFormManagerStore(
    state => state.updateActivePattern
  );
  const focus = useFormManagerStore(state => state.focus);
  const methods = useForm<PatternMap>({
    defaultValues: {
      [pattern.id]: pattern,
    },
  });

  useEffect(() => {
    methods.clearErrors();
    Object.entries(focus?.errors || {}).forEach(([field, error]) => {
      console.log(focus?.errors, field, formErrorToReactHookFormError(error));
      methods.setError(
        `${focus?.pattern.id}.data.label`,
        formErrorToReactHookFormError(error)
      );
    });
  }, [focus]);

  return (
    <FormProvider {...methods}>
      <form
        onBlur={methods.handleSubmit(formData => {
          updateActivePattern(formData);
        })}
      >
        <div className="border-1 radius-md border-primary-light padding-1">
          {editComponent}
        </div>
      </form>
    </FormProvider>
  );
};

const formErrorToReactHookFormError = (error: FormError): ErrorOption => {
  if (error.type === 'required') {
    return {
      type: 'required',
      message: error.message,
    };
  } else {
    return {
      type: 'custom',
      message: error.message,
    };
  }
};
