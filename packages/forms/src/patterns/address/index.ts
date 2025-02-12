import * as z from 'zod';

import { type Pattern, type PatternConfig } from '../../pattern.js';
import { AddressComponentProps } from '../../components.js';
import { getFormSessionValue } from '../../session.js';
import {
  convertZodErrorToFormErrors,
  safeZodParseFormErrors,
} from '../../util/zod.js';
import { stateTerritoryOrMilitaryPostList } from './jurisdictions.js';
import { FormError, FormErrors } from '../../error.js';

export const AddressSchema = z.object({
  physicalStreetAddress: z
    .string()
    .min(1, { message: 'Street address is required' })
    .max(128, { message: 'Street address must be less than 128 characters' }),
  physicalStreetAddress2: z
    .string()
    .max(128, {
      message: 'Street address line 2 must be less than 128 characters',
    })
    .optional(),
  physicalCity: z
    .string()
    .min(1, { message: 'City is required' })
    .max(64, { message: 'City must be less than 64 characters' }),
  physicalStateTerritoryOrMilitaryPost: z
    .string()
    .min(1, { message: 'State, territory, or military post is required' }),
  physicalZipCode: z
    .string()
    .min(1, { message: 'ZIP code is required' })
    .max(10, { message: 'ZIP code must be less than 10 characters' }),
  physicalUrbanizationCode: z
    .string()
    .max(128, { message: 'Urbanization code must be less than 128 characters' })
    .optional(),
  physicalGooglePlusCode: z.string().max(8),

  mailingStreetAddress: z
    .string()
    .min(1, { message: 'Street address is required' })
    .max(128, { message: 'Street address must be less than 128 characters' }),
  mailingStreetAddress2: z
    .string()
    .max(128, {
      message: 'Street address line 2 must be less than 128 characters',
    })
    .optional(),
  mailingCity: z
    .string()
    .min(1, { message: 'City is required' })
    .max(64, { message: 'City must be less than 64 characters' }),
  mailingStateTerritoryOrMilitaryPost: z
    .string()
    .min(1, { message: 'State, territory, or military post is required' }),
  mailingZipCode: z
    .string()
    .min(1, { message: 'ZIP code is required' })
    .max(10, { message: 'ZIP code must be less than 10 characters' }),
  mailingUrbanizationCode: z
    .string()
    .max(128, { message: 'Urbanization code must be less than 128 characters' })
    .optional(),
  mailingGooglePlusCode: z.string().max(8),
});

const configSchema = z.object({
  legend: z.string().min(1),
  required: z.boolean(),
  addMailingAddress: z.boolean().optional(),
});

export type AddressPattern = Pattern<z.infer<typeof configSchema>>;

export type AddressPatternOutput = z.infer<typeof AddressSchema>;

const parseUserInput = (_: unknown, obj: z.infer<typeof AddressSchema>) => {
  const result = AddressSchema.safeParse(obj);
  console.log('TEST ADDRESS result', result);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    const fieldErrors = convertZodErrorToFormErrors(result.error);

    // Filter out fields with errors
    const validData = Object.keys(obj).reduce(
      (acc, key) => {
        const typedKey = key as keyof z.infer<typeof AddressSchema>;
        if (!fieldErrors[typedKey]) {
          acc[typedKey] = obj[typedKey];
        }
        return acc;
      },
      {} as Partial<z.infer<typeof AddressSchema>>
    );

    console.log('TEST ADDRESS validData', validData);
    console.log('TEST ADDRESS fieldErrors', fieldErrors);
    return {
      success: false,
      error: {
        type: 'custom',
        fields: fieldErrors,
      },
      data: validData, // Only include non-error fields
    };
  }
};

const parseConfigData = (obj: unknown) =>
  safeZodParseFormErrors(configSchema, obj);

const createPromptProps = (
  sessionValue: Partial<z.infer<typeof AddressSchema>> | undefined,
  pattern: { id: string },
  error: FormErrors,
  prefix: string
) => ({
  [`${prefix}StreetAddress`]: {
    type: 'input' as const,
    inputId: `${pattern.id}.${prefix}StreetAddress`,
    value:
      sessionValue?.[`${prefix}StreetAddress` as keyof typeof sessionValue] ??
      '',
    label: 'Street address',
    required: true,
    error: error?.[`${prefix}StreetAddress`],
  },
  [`${prefix}StreetAddress2`]: {
    type: 'input' as const,
    inputId: `${pattern.id}.${prefix}StreetAddress2`,
    value:
      sessionValue?.[`${prefix}StreetAddress2` as keyof typeof sessionValue] ??
      '',
    label: 'Street address line 2',
    required: false,
    error: error?.[`${prefix}StreetAddress2`],
  },
  [`${prefix}City`]: {
    type: 'input' as const,
    inputId: `${pattern.id}.${prefix}City`,
    value: sessionValue?.[`${prefix}City` as keyof typeof sessionValue] ?? '',
    label: 'City',
    required: true,
    error: error?.[`${prefix}City`],
  },
  [`${prefix}StateTerritoryOrMilitaryPost`]: {
    type: 'select' as const,
    inputId: `${pattern.id}.${prefix}StateTerritoryOrMilitaryPost`,
    value:
      sessionValue?.[
        `${prefix}StateTerritoryOrMilitaryPost` as keyof typeof sessionValue
      ] ?? '',
    label: 'State, territory, or military post',
    required: true,
    options: stateTerritoryOrMilitaryPostList,
    error: error?.[`${prefix}StateTerritoryOrMilitaryPost`],
  },
  [`${prefix}ZipCode`]: {
    type: 'input' as const,
    inputId: `${pattern.id}.${prefix}ZipCode`,
    value:
      sessionValue?.[`${prefix}ZipCode` as keyof typeof sessionValue] ?? '',
    label: 'ZIP code',
    required: true,
    error: error?.[`${prefix}ZipCode`],
  },
  [`${prefix}UrbanizationCode`]: {
    type: 'input' as const,
    inputId: `${pattern.id}.${prefix}UrbanizationCode`,
    value:
      sessionValue?.[
        `${prefix}UrbanizationCode` as keyof typeof sessionValue
      ] ?? '',
    label: 'Urbanization (Puerto Rico only)',
    required: false,
    error: error?.[`${prefix}UrbanizationCode`],
  },
  [`${prefix}GooglePlusCode`]: {
    type: 'input' as const,
    inputId: `${pattern.id}.${prefix}GooglePlusCode`,
    value:
      sessionValue?.[`${prefix}GooglePlusCode` as keyof typeof sessionValue] ??
      '',
    label: 'Google Plus Code',
  },
});

export const addressConfig: PatternConfig<
  AddressPattern,
  AddressPatternOutput
> = {
  displayName: 'Address',
  iconPath: 'block-icon.svg',
  initial: {
    legend: 'Physical Address',
    required: true,
    addMailingAddress: false,
  },
  // @ts-ignore
  parseUserInput,
  parseConfigData,
  getChildren(pattern, patterns) {
    return [];
  },
  createPrompt(config, session, pattern, options) {
    const sessionValue = getFormSessionValue(session, pattern.id) as Partial<
      z.infer<typeof AddressSchema>
    >;
    const error = session.data.errors[pattern.id] as FormError;

    // Separate errors for physical and mailing addresses
    const physicalErrors = Object.fromEntries(
      Object.entries(error?.fields || {}).filter(([key]) =>
        key.startsWith('physical')
      )
    );

    const mailingErrors = Object.fromEntries(
      Object.entries(error?.fields || {}).filter(([key]) =>
        key.startsWith('mailing')
      )
    );

    return {
      props: {
        _patternId: pattern.id,
        type: 'address',
        childProps: {
          ...createPromptProps(
            sessionValue,
            pattern,
            physicalErrors,
            'physical'
          ),
          ...(pattern.data.addMailingAddress
            ? createPromptProps(sessionValue, pattern, mailingErrors, 'mailing')
            : {}),
        },
        error: {
          physical:
            Object.keys(physicalErrors).length > 0
              ? {
                  type: 'custom',
                  message: 'All required fields must be filled out',
                }
              : undefined,
          mailing:
            Object.keys(mailingErrors).length > 0
              ? {
                  type: 'custom',
                  message: 'All required fields must be filled out',
                }
              : undefined,
        },
        legend: pattern.data.legend,
        required: pattern.data.required,
        addMailingAddress: pattern.data.addMailingAddress,
      } satisfies AddressComponentProps,
      children: [],
    };
  },
};
