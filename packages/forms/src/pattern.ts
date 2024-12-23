import * as r from '@atj/common';
import set from 'set-value';

import { type CreatePrompt } from './components.js';
import { type FormError, type FormErrors } from './error.js';
import { type Blueprint } from './types.js';

export type Pattern<C = any> = {
  type: string;
  id: PatternId;
  data: C;
};

export type PatternId = string;
export type PatternValue<T extends Pattern = Pattern> = any;
export type PatternValueMap = Record<PatternId, PatternValue>;
export type PatternMap = Record<PatternId, Pattern>;
export type GetPattern<T extends Pattern = Pattern> = (
  form: Blueprint,
  id: PatternId
) => Pattern;

export type ParseUserInput<Pattern, PatternOutput> = (
  pattern: Pattern,
  obj: unknown
) => r.Result<PatternOutput, FormError>;

export type ParsePatternConfigData<PatternConfigData> = (
  patternData: unknown
) => r.Result<PatternConfigData, FormErrors>;

type RemoveChildPattern<P extends Pattern> = (
  pattern: P,
  patternId: PatternId
) => P;

export abstract class PatternBuilder<P extends Pattern> {
  public readonly id: PatternId;
  public readonly data: P['data'];

  constructor(data: P['data'], id?: PatternId) {
    this.id = id || generatePatternId();
    this.data = data;
  }

  abstract toPattern(): P;
}

export const getPattern = <T extends Pattern = Pattern>(
  form: Blueprint,
  id: PatternId
): T => {
  return form.patterns[id] as T;
};

export const getPatternSafely = <P extends Pattern>(opts: {
  type: string;
  form: Blueprint;
  patternId: PatternId;
}): r.Result<P> => {
  const pattern = opts.form.patterns[opts.patternId];
  if (pattern === undefined) {
    return r.failure(`Pattern with id ${opts.patternId} does not exist`);
  }
  if (pattern.type !== opts.type) {
    return r.failure(
      `Pattern with id ${opts.patternId} is not of type ${opts.type}`
    );
  }
  return r.success(pattern as P);
};

export const updatePattern = (form: Blueprint, pattern: Pattern): Blueprint => {
  return {
    ...form,
    patterns: {
      ...form.patterns,
      [pattern.id]: pattern,
    },
  };
};

export type PatternConfig<
  ThisPattern extends Pattern = Pattern,
  PatternOutput = unknown,
> = {
  displayName: string;
  iconPath?: string;
  initial: ThisPattern['data'];
  parseUserInput?: ParseUserInput<ThisPattern, PatternOutput>;
  parseConfigData: ParsePatternConfigData<ThisPattern['data']>;
  getChildren: (
    pattern: ThisPattern,
    patterns: Record<PatternId, Pattern>
  ) => Pattern[];
  removeChildPattern?: RemoveChildPattern<ThisPattern>;
  createPrompt: CreatePrompt<ThisPattern>;
};

export type FormConfig<T extends Pattern = Pattern, PatternOutput = unknown> = {
  patterns: Record<string, PatternConfig<T, PatternOutput>>;
};

export const getPatternMap = (patterns: Pattern[]) => {
  return Object.fromEntries(
    patterns.map(pattern => {
      return [pattern.id, pattern];
    })
  );
};

export const getPatternConfig = (
  config: FormConfig,
  elementType: Pattern['type']
) => {
  return config.patterns[elementType];
};

export const validatePattern = (
  patternConfig: PatternConfig,
  pattern: Pattern,
  value: any
): r.Result<Pattern['data'], FormError> => {
  if (!patternConfig.parseUserInput) {
    return {
      success: true,
      data: value,
    };
  }
  const parseResult = patternConfig.parseUserInput(pattern, value);
  if (!parseResult.success) {
    return r.failure(parseResult.error);
  }
  return r.success(parseResult.data);
};

const aggregateValuesByPrefix = (
  values: Record<string, string>
): Record<string, any> => {
  const aggregatedValues: Record<string, any> = {};

  for (const [key, value] of Object.entries(values)) {
    set(aggregatedValues, key, value);
  }

  return aggregatedValues;
};

export const aggregatePatternSessionValues = (
  config: FormConfig,
  form: Blueprint,
  patternConfig: PatternConfig,
  pattern: Pattern,
  values: Record<string, string>,
  result: {
    values: Record<PatternId, PatternValue>;
    errors: Record<PatternId, FormError>;
  }
) => {
  const aggregatedValues = aggregateValuesByPrefix(values);

  if (patternConfig.parseUserInput) {
    const patternValues = aggregatedValues[pattern.id];
    const parseResult = patternConfig.parseUserInput(pattern, patternValues);

    if (parseResult.success) {
      result.values[pattern.id] = parseResult.data;
      delete result.errors[pattern.id];
    } else {
      result.values[pattern.id] = values[pattern.id];
      result.errors[pattern.id] = parseResult.error;
    }
  }
  for (const child of patternConfig.getChildren(pattern, form.patterns)) {
    const childPatternConfig = getPatternConfig(config, child.type);
    aggregatePatternSessionValues(
      config,
      form,
      childPatternConfig,
      child,
      values,
      result
    );
  }
  return result;
};

export const getFirstPattern = (
  config: FormConfig,
  form: Blueprint,
  pattern?: Pattern
): Pattern => {
  if (!pattern) {
    pattern = form.patterns[form.root];
  }
  const elemConfig = getPatternConfig(config, pattern.type);
  const children = elemConfig.getChildren(pattern, form.patterns);
  if (children?.length === 0) {
    return pattern;
  }
  return getFirstPattern(config, form, children[0]);
};

export const updatePatternFromFormData = (
  config: FormConfig,
  form: Blueprint,
  pattern: Pattern,
  formData: PatternMap
): r.Result<Blueprint, FormErrors> => {
  const elementConfig = getPatternConfig(config, pattern.type);
  const result = elementConfig.parseConfigData(formData[pattern.id]);
  if (!result.success) {
    return result;
  }
  const updatedForm = updatePattern(form, {
    ...pattern,
    data: result.data,
  });
  return {
    success: true,
    data: updatedForm,
  };
};

export const generatePatternId = () => crypto.randomUUID();

export const createDefaultPattern = (
  config: FormConfig,
  patternType: string
): Pattern => {
  return {
    id: generatePatternId(),
    type: patternType,
    data: config.patterns[patternType].initial,
  };
};

export const createPattern = <T extends Pattern>(
  config: FormConfig,
  patternType: keyof FormConfig['patterns'],
  configData: T['data'],
  patternId?: PatternId
): r.Result<T, FormErrors> => {
  const result = config.patterns[patternType].parseConfigData(
    configData || config.patterns[patternType].initial
  );
  if (!result.success) {
    return r.failure(result.error);
  }
  return r.success({
    id: patternId || generatePatternId(),
    type: patternType,
    data: result.data,
  } as T);
};

export const removeChildPattern = (
  config: FormConfig,
  pattern: Pattern,
  id: PatternId
) => {
  const remove = config.patterns[pattern.type].removeChildPattern;
  if (!remove) {
    return pattern;
  }
  return remove(pattern, id);
};
