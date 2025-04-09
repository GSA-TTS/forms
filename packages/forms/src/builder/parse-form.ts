import * as z from 'zod';

import { failure, success, type Result } from '@gsa-tts/forms-common';
import type { FormConfig } from '../pattern';
import type { Blueprint } from '../types';

/**
 * Parses and validates an object against a form schema defined by the given configuration.
 */
export const parseForm = (config: FormConfig, obj: any): Result<Blueprint> => {
  const formSchema = createFormSchema(config);
  const result = formSchema.safeParse(obj);
  if (result.data) syncFormSummary(result.data);

  if (result.error) {
    return failure(result.error.message);
  }
  return success(result.data);
};

export const parseFormString = (
  config: FormConfig,
  json: string
): Result<Blueprint> => {
  return parseForm(config, JSON.parse(json));
};

const createFormSchema = (config: FormConfig) => {
  return z.object({
    summary: z.object({
      title: z.string(),
      description: z.string(),
    }),
    root: z.string(),
    patterns: z.record(
      z.string(),
      z.any().refine(
        val => {
          const patternConfig = config.patterns[val?.type];
          if (!patternConfig) {
            return false;
          }
          const result = patternConfig.parseConfigData(val?.data);
          if (!result.success) {
            const message = Object.values(result.error)
              .map(err => err.message || '')
              .join(', ');
            console.error(val?.type, result.error);
            console.error(`Pattern config error: ${message}`);
          }
          return result.success;
        },
        {
          message: 'Invalid pattern',
        }
      )
    ),
    outputs: z.array(
      z.object({
        id: z.string(),
        path: z.string(),
        fields: z.record(z.string(), z.any()),
        formFields: z.record(z.string(), z.string()),
      })
    ),
  });
};

const syncFormSummary = (blueprint: Blueprint): Blueprint => {
  if (!blueprint || !blueprint.patterns || !blueprint.summary) return blueprint;

  const { patterns, summary } = blueprint;
  const formSummaryPattern = Object.values(patterns).find(
    (pattern: any) => pattern.type === 'form-summary'
  );

  if (!formSummaryPattern) return blueprint;
  
  // Check if the pattern has data property before accessing it
  if (!formSummaryPattern.data) return blueprint;
  
  // Now it's safe to access title and description
  const { title, description } = formSummaryPattern.data;
  
  // Only update if values exist and differ
  if (title !== undefined && summary.title !== title) {
    summary.title = title;
  }
  
  if (description !== undefined && summary.description !== description) {
    summary.description = description;
  }

  return blueprint;
};
