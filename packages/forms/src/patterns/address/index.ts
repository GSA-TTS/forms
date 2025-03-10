import * as z from 'zod';

import { type Pattern, type PatternConfig } from '../../pattern.js';
import { AddressComponentProps } from '../../components.js';
import { getFormSessionError, getFormSessionValue } from '../../session.js';
import {
  convertZodErrorToFormErrors,
  safeZodParseFormErrors,
} from '../../util/zod.js';
import { stateTerritoryOrMilitaryPostList } from './jurisdictions.js';

const baseAddressSchema = z.object({
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
    .max(10, { message: 'ZIP code must be less than 10 characters' }),
  physicalUrbanizationCode: z
    .string()
    .max(128, { message: 'Urbanization code must be less than 128 characters' })
    .optional(),
  physicalGooglePlusCode: z.string().max(8).optional(),

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
    .max(10, { message: 'ZIP code must be less than 10 characters' }),
  mailingUrbanizationCode: z
    .string()
    .max(128, { message: 'Urbanization code must be less than 128 characters' })
    .optional(),
  mailingGooglePlusCode: z.string().max(8).optional(),

  isMailingAddressSameAsPhysical: z.string().optional(),
});

export type AddressPatternOutput = z.infer<typeof baseAddressSchema>;

export const createAddressSchema = (data: { required: boolean }) => {
  const schema = baseAddressSchema.superRefine((fields, ctx) => {
    const requiredPhysicalFields = [
      'physicalStreetAddress',
      'physicalCity',
      'physicalStateTerritoryOrMilitaryPost',
    ] as const;

    const requiredMailingFields = [
      'mailingStreetAddress',
      'mailingCity',
      'mailingStateTerritoryOrMilitaryPost',
    ] as const;

    const hasPhysicalError = requiredPhysicalFields.some(
      field => !fields[field]
    );
    const hasMailingError = requiredMailingFields.some(field => !fields[field]);

    if (hasPhysicalError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'All required fields must be filled out',
        path: ['_physical'],
      });
    }

    if (hasMailingError) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'All required fields must be filled out',
        path: ['_mailing'],
      });
    }
  });

  return schema;
};

const configSchema = z.object({
  legend: z.string().min(1),
  required: z.boolean(),
  addMailingAddress: z.boolean().optional(),
});

export type AddressPattern = Pattern<z.infer<typeof configSchema>>;

const parseUserInput = (
  pattern: AddressPattern,
  obj: z.infer<typeof baseAddressSchema>
) => {
  const result = createAddressSchema(pattern.data).safeParse(obj);
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
        const typedKey = key as keyof z.infer<typeof baseAddressSchema>;
        if (!fieldErrors[typedKey]) {
          acc[typedKey] = obj[typedKey];
        }
        return acc;
      },
      {} as Partial<z.infer<typeof baseAddressSchema>>
    );

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

const createPromptProps = (pattern: { id: string }, prefix: string) => {
  const props = {
    [`${prefix}StreetAddress`]: {
      type: 'input' as const,
      inputId: `${pattern.id}.${prefix}StreetAddress`,
      value: '',
      label: 'Street address',
      required: prefix !== 'physical',
    },
    [`${prefix}StreetAddress2`]: {
      type: 'input' as const,
      inputId: `${pattern.id}.${prefix}StreetAddress2`,
      value: '',
      label: 'Street address line 2',
      required: false,
    },
    [`${prefix}City`]: {
      type: 'input' as const,
      inputId: `${pattern.id}.${prefix}City`,
      value: '',
      label: 'City',
      required: true,
    },
    [`${prefix}StateTerritoryOrMilitaryPost`]: {
      type: 'select' as const,
      inputId: `${pattern.id}.${prefix}StateTerritoryOrMilitaryPost`,
      value: '',
      label: 'State, territory, or military post',
      required: true,
      options: stateTerritoryOrMilitaryPostList,
    },
    [`${prefix}ZipCode`]: {
      type: 'input' as const,
      inputId: `${pattern.id}.${prefix}ZipCode`,
      value: '',
      label: 'ZIP code',
      required: false,
    },
    [`${prefix}UrbanizationCode`]: {
      type: 'input' as const,
      inputId: `${pattern.id}.${prefix}UrbanizationCode`,
      value: '',
      label: 'Urbanization (Puerto Rico only)',
      required: false,
    },
  };

  if (prefix !== 'mailing') {
    props[`${prefix}GooglePlusCode`] = {
      type: 'input' as const,
      inputId: `${pattern.id}.${prefix}GooglePlusCode`,
      value: '',
      label: 'Google Plus Code',
      required: false,
    };
  }

  return props;
};

export const addressConfig: PatternConfig<
  AddressPattern,
  AddressPatternOutput
> = {
  displayName: 'Address',
  iconPath: 'address-icon.svg',
  initial: {
    legend: 'Physical address',
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
    const sessionValue = getFormSessionValue(session, pattern.id);
    const sessionError = getFormSessionError(session, pattern.id);

    return {
      props: {
        _patternId: pattern.id,
        type: 'address',
        childProps: {
          ...createPromptProps(pattern, 'physical'),
          ...(pattern.data.addMailingAddress
            ? createPromptProps(pattern, 'mailing')
            : {}),
        },
        error: sessionError,
        value: sessionValue,
        legend: pattern.data.legend,
        required: pattern.data.required,
        addMailingAddress: pattern.data.addMailingAddress,
        isMailingAddressSameAsPhysical:
          sessionValue?.isMailingAddressSameAsPhysical === 'on',
      } satisfies AddressComponentProps,
      children: [],
    };
  },
};
