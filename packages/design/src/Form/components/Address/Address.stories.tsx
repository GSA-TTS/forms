import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import AddressPattern from './Address.js';
import { stateTerritoryOrMilitaryPostList } from '@gsa-tts/forms-core';

const meta: Meta<typeof AddressPattern> = {
  title: 'patterns/Address',
  component: AddressPattern,
  decorators: [
    Story => {
      const formMethods = useForm({
        defaultValues: {
          'address.physicalStreetAddress': '',
          'address.physicalStreetAddress2': '',
          'address.physicalCity': '',
          'address.physicalStateTerritoryOrMilitaryPost': '',
          'address.physicalZipCode': '',
          'address.mailingStreetAddress': '',
          'address.mailingStreetAddress2': '',
          'address.mailingCity': '',
          'address.mailingStateTerritoryOrMilitaryPost': '',
          'address.mailingZipCode': '',
        },
      });
      return (
        <div className="padding-left-2">
          <FormProvider {...formMethods}>
            <Story />
          </FormProvider>
        </div>
      );
    },
  ],
  tags: ['autodocs'],
};

export default meta;

const baseChildProps = {
  physicalStreetAddress: {
    type: 'input' as const,
    inputId: 'address.physicalStreetAddress',
    value: '',
    label: 'Street Address',
    required: false,
  },
  physicalStreetAddress2: {
    type: 'input' as const,
    inputId: 'address.physicalStreetAddress2',
    value: '',
    label: 'Street Address 2',
    required: false,
  },
  physicalCity: {
    type: 'input' as const,
    inputId: 'address.physicalCity',
    value: '',
    label: 'City',
    required: true,
  },
  physicalStateTerritoryOrMilitaryPost: {
    type: 'select' as const,
    inputId: 'address.physicalStateTerritoryOrMilitaryPost',
    value: '',
    label: 'State',
    required: true,
    options: stateTerritoryOrMilitaryPostList,
  },
  physicalZipCode: {
    type: 'input' as const,
    inputId: 'address.physicalZipCode',
    value: '',
    label: 'ZIP Code',
    required: false,
    pattern: '[\\d]{5}(-[\\d]{4})?',
  },
  physicalUrbanizationCode: {
    type: 'input' as const,
    inputId: 'address.physicalUrbanizationCode',
    value: '',
    label: 'Urbanization Code',
    required: false,
  },
  physicalGooglePlusCode: {
    type: 'input' as const,
    inputId: 'address.physicalGooglePlusCode',
    value: '',
    label: 'Google Plus Code',
    required: false,
  },
  mailingStreetAddress: {
    type: 'input' as const,
    inputId: 'address.mailingStreetAddress',
    value: '',
    label: 'Mailing Street Address',
    required: true,
  },
  mailingStreetAddress2: {
    type: 'input' as const,
    inputId: 'address.mailingStreetAddress2',
    value: '',
    label: 'Mailing Street Address 2',
    required: false,
  },
  mailingCity: {
    type: 'input' as const,
    inputId: 'address.mailingCity',
    value: '',
    label: 'Mailing City',
    required: true,
  },
  mailingStateTerritoryOrMilitaryPost: {
    type: 'select' as const,
    inputId: 'address.mailingStateTerritoryOrMilitaryPost',
    value: '',
    label: 'Mailing State',
    required: true,
    options: stateTerritoryOrMilitaryPostList,
  },
  mailingZipCode: {
    type: 'input' as const,
    inputId: 'address.mailingZipCode',
    value: '',
    label: 'Mailing ZIP Code',
    required: false,
    pattern: '[\\d]{5}(-[\\d]{4})?',
  },
  mailingUrbanizationCode: {
    type: 'input' as const,
    inputId: 'address.mailingUrbanizationCode',
    value: '',
    label: 'Mailing Urbanization Code',
    required: false,
  },
};

export const Default: StoryObj<typeof AddressPattern> = {
  args: {
    _patternId: '',
    type: 'address',
    childProps: {
      ...baseChildProps,
    },
  },
};

export const WithError: StoryObj<typeof AddressPattern> = {
  args: {
    _patternId: '',
    type: 'address',
    childProps: {
      ...baseChildProps,
      mailingStreetAddress: {
        ...baseChildProps.mailingStreetAddress,
        required: true,
      },
      mailingCity: {
        ...baseChildProps.mailingCity,
        required: true,
      },
      mailingStateTerritoryOrMilitaryPost: {
        ...baseChildProps.mailingStateTerritoryOrMilitaryPost,
        required: true,
      },
    },
    addMailingAddress: true,
    error: {
      type: 'custom',
      fields: {
        physicalStreetAddress: {
          type: 'custom',
          message: 'Invalid street address format. Please check and try again.',
        },
        physicalZipCode: {
          type: 'custom',
          message: 'Invalid ZIP code format. Please check and try again.',
        },
        physicalCity: {
          type: 'custom',
          message: 'Invalid city name. Please check and try again.',
        },
        mailingStreetAddress: {
          type: 'custom',
          message:
            'Invalid mailing street address format. Please check and try again.',
        },
        _physical: {
          type: 'custom',
          message: 'Physical address is required.',
        },
        _mailing: {
          type: 'custom',
          message: 'Mailing address is required.',
        },
      },
    },
  },
};

export const WithMailingAddress: StoryObj<typeof AddressPattern> = {
  args: {
    _patternId: '',
    type: 'address',
    childProps: {
      ...baseChildProps,
      mailingStreetAddress: {
        ...baseChildProps.mailingStreetAddress,
        required: true,
      },
      mailingCity: {
        ...baseChildProps.mailingCity,
        required: true,
      },
      mailingStateTerritoryOrMilitaryPost: {
        ...baseChildProps.mailingStateTerritoryOrMilitaryPost,
        required: true,
      },
    },
    addMailingAddress: true,
  },
};
