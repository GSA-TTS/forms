import { getRootPattern } from './blueprint.js';
import { type FormError } from './error.js';
import {
  type FormConfig,
  type Pattern,
  type PatternId,
  getPatternConfig,
} from './pattern.js';
import { type FormSession, nullSession, sessionIsComplete } from './session.js';
import { type ActionName } from './submission.js';

export type PackageDownloadProps = PatternProps<{
  type: 'package-download';
  text: string;
  actions: PromptAction[];
}>;

export type TextInputProps = PatternProps<{
  type: 'input';
  inputId: string;
  value: string;
  label: string;
  required: boolean;
  error?: FormError;
}>;

export type FormSummaryProps = PatternProps<{
  type: 'form-summary';
  title: string;
  description: string;
}>;

export type SubmissionConfirmationProps = PatternProps<{
  type: 'submission-confirmation';
  table: { label: string; value: string }[];
}>;

export type ParagraphProps = PatternProps<{
  type: 'paragraph';
  text: string;
  style: 'indent' | 'normal' | 'heading' | 'subheading';
}>;

export type RichTextProps = PatternProps<{
  type: 'rich-text';
  text: string;
}>;

export type FieldsetProps = PatternProps<{
  type: 'fieldset';
  legend?: string;
  subHeading?: string;
  error?: FormError;
}>;

export type ZipcodeProps = PatternProps<{
  type: 'zipcode';
  inputId: string;
  value: string;
}>;

export type CheckboxProps = PatternProps<{
  type: 'checkbox';
  id: string;
  label: string;
  defaultChecked: boolean;
}>;

export type PageSetProps = PatternProps<{
  type: 'page-set';
  pages: { title: string; selected: boolean; url: string }[];
  actions: PromptAction[];
}>;

export type PageProps = PatternProps<{
  type: 'page';
  title: string;
}>;

export type RadioGroupProps = PatternProps<{
  type: 'radio-group';
  groupId: string;
  legend: string;
  options: {
    id: string;
    name: string;
    label: string;
    defaultChecked: boolean;
  }[];
}>;

export type SelectDropdownProps = PatternProps<{
  type: 'select-dropdown';
  selectId: string;
  options: {
    value: string;
    label: string;
  }[];
  label: string;
  required: boolean;
  error?: FormError;
}>;

export type DateOfBirthProps = PatternProps<{
  type: 'date-of-birth';
  dayId: string;
  monthId: string;
  yearId: string;
  label: string;
  hint?: string;
  required: boolean;
  error?: FormError;
}>;

export type SequenceProps = PatternProps<{
  type: 'sequence';
}>;

export type PatternProps<T = {}> = {
  _patternId: PatternId;
  type: string;
} & T;

export type SubmitAction = {
  type: 'submit';
  submitAction: 'next' | 'submit' | ActionName;
  text: string;
};
export type LinkAction = {
  type: 'link';
  text: string;
  url: string;
};
export type PromptAction = SubmitAction | LinkAction;

export type PromptComponent = {
  props: PatternProps;
  children: PromptComponent[];
};

export type Prompt = {
  components: PromptComponent[];
};

export const createPrompt = (
  config: FormConfig,
  session: FormSession,
  options: { validate: boolean }
): Prompt => {
  if (options.validate && sessionIsComplete(config, session)) {
    return {
      components: [
        {
          props: {
            _patternId: 'submission-confirmation',
            type: 'submission-confirmation',
            table: Object.entries(session.data.values)
              .filter(([patternId, value]) => {
                const elemConfig = getPatternConfig(
                  config,
                  session.form.patterns[patternId].type
                );
                return !!elemConfig.parseUserInput;
              })
              .map(([patternId, value]) => {
                return {
                  label: session.form.patterns[patternId].data.label,
                  value: value,
                };
              }),
          } as SubmissionConfirmationProps,
          children: [],
        },
      ],
    };
  }
  const components: PromptComponent[] = [];
  const root = getRootPattern(session.form);
  components.push(createPromptForPattern(config, session, root, options));
  return {
    components,
  };
};

export type CreatePrompt<T> = (
  config: FormConfig,
  session: FormSession,
  pattern: T,
  options: { validate: boolean }
) => PromptComponent;

export const createPromptForPattern: CreatePrompt<Pattern> = (
  config,
  session,
  pattern,
  options
) => {
  const patternConfig = getPatternConfig(config, pattern.type);
  if (!patternConfig) {
    throw new Error(
      `Pattern config not found for pattern type ${pattern.type} with id ${pattern.id} and config ${JSON.stringify(config, null, 2)}`
    );
  }
  return patternConfig.createPrompt(config, session, pattern, options);
};

export const createNullPrompt = ({
  config,
  pattern,
}: {
  config: FormConfig;
  pattern: Pattern;
}): Prompt => {
  const formPatternConfig = getPatternConfig(config, pattern.type);
  return {
    components: [
      formPatternConfig.createPrompt(config, nullSession, pattern, {
        validate: false,
      }),
    ],
  };
};
