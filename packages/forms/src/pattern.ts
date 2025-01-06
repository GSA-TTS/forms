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
  obj: unknown,
  config?: FormConfig,
  form?: Blueprint
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

/**
 * Retrieves a specific pattern from the given blueprint using its unique identifier.
 */
export const getPattern = <T extends Pattern = Pattern>(
  form: Blueprint,
  id: PatternId
): T => {
  return form.patterns[id] as T;
};

/**
 * Retrieves a pattern of a specific type safely from a blueprint form.
 * Validates if the pattern exists and if its type matches the specified type.
 */
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

/**
 * Updates the `patterns` property of a given Blueprint object by adding or replacing
 * a Pattern object with the specified ID.
 */
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

/**
 * Constructs a map from an array of patterns, using each pattern's `id` as the key.
 */
export const getPatternMap = (patterns: Pattern[]) => {
  return Object.fromEntries(
    patterns.map(pattern => {
      return [pattern.id, pattern];
    })
  );
};

/**
 * Retrieves the pattern configuration for a specified element type from the given form configuration.
 */
export const getPatternConfig = (
  config: FormConfig,
  elementType: Pattern['type']
) => {
  return config.patterns[elementType];
};

/**
 * Validates a given value against a specified pattern using the provided pattern configuration.
 */
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

const setNestedValue = (
  obj: Record<string, any>,
  path: string[],
  value: any
): void => {
  path.reduce((acc, key, idx) => {
    if (idx === path.length - 1) {
      acc[key] = value;
    } else {
      if (!acc[key]) {
        acc[key] = isNaN(Number(path[idx + 1])) ? {} : [];
      }
    }
    return acc[key];
  }, obj);
};

const aggregateValuesByPrefix = (
  values: Record<string, any>
): Record<string, any> => {
  const aggregatedValues: Record<string, any> = {};
  for (const [key, value] of Object.entries(values)) {
    const keys = key.split('.');
    setNestedValue(aggregatedValues, keys, value);
  }
  return aggregatedValues;
};

/**
 * Processes and aggregates values and errors for a given pattern and its children within a session.
 * This function ensures that user input is parsed and validated per pattern configuration and
 * recursively handles child patterns within the associated form.
 */
export const aggregatePatternSessionValues = (
  config: FormConfig,
  form: Blueprint,
  patternConfig: PatternConfig,
  pattern: Pattern,
  values: Record<string, any>,
  result: {
    values: Record<PatternId, PatternValue>;
    errors: Record<PatternId, FormError>;
  }
) => {
  const aggregatedValues = aggregateValuesByPrefix(values);
  if (patternConfig.parseUserInput) {
    const isRepeaterType = pattern.type === 'repeater';
    const patternValues = aggregatedValues[pattern.id];
    let parseResult: any = patternConfig.parseUserInput(
      pattern,
      patternValues,
      config,
      form
    );

    if (parseResult.success) {
      result.values[pattern.id] = parseResult.data;
      delete result.errors[pattern.id];
    } else {
      result.values[pattern.id] = isRepeaterType
        ? parseResult.data
        : values[pattern.id];
      result.errors[pattern.id] = parseResult.error;
    }
  } else {
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
  }
  return result;
};

/**
 * Retrieves the first pattern from a form blueprint based on the specified configuration
 * and the provided or default starting pattern.
 */
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

/**
 * Updates a specific pattern in a form blueprint by parsing the provided form data and
 * applying the updated pattern configuration to the form.
 */
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

/**
 * Generates a unique identifier string using the `crypto.randomUUID` method.
 */
export const generatePatternId = () => crypto.randomUUID();

/**
 * Generates a default pattern object based on the provided configuration and pattern type.
 */
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

/**
 * Creates a new pattern instance based on the provided configuration, pattern type, config data, and optionally a pattern ID.
 */
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

/**
 * A function that removes a child pattern from a given pattern within a configuration.
 */
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
