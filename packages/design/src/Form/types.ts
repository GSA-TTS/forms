import {
  type FormConfig,
  type PatternProps,
  type PromptComponent,
} from '@gsa-tts/forms-core';

export type FormUIContext = {
  config: FormConfig;
  components: ComponentForPattern;
  uswdsRoot: `${string}/`;
};

export type ComponentForPattern<T extends PatternProps = PatternProps> = Record<
  string,
  PatternComponent<T>
>;

export type PatternComponent<T extends PatternProps = PatternProps<unknown>> =
  React.ComponentType<
    T & {
      context: FormUIContext;
      childComponents?: PromptComponent[];
    }
  >;
