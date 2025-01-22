type FormErrorType = 'required' | 'custom';

export type FormError = {
  type: FormErrorType;
  message?: string;
  fields?: FormErrors;
};

export type FormErrors = Record<string, FormError>;
