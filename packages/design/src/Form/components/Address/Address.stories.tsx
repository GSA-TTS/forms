import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Meta, type StoryObj } from '@storybook/react';

import AddressPattern from './index.js';
// import { stateTerritoryOrMilitaryPostList } from '..';

const stateTerritoryOrMilitaryPostList = [
  { abbr: 'AL', label: 'AL - Alabama' },
  { abbr: 'AK', label: 'AK - Alaska' },
  { abbr: 'AS', label: 'AS - American' },
  { abbr: 'AZ', label: 'AZ - Arizona' },
  { abbr: 'AR', label: 'AR - Arkansas' },
  { abbr: 'CA', label: 'CA - California' },
  { abbr: 'CO', label: 'CO - Colorado' },
  { abbr: 'CT', label: 'CT - Connecticut' },
  { abbr: 'DE', label: 'DE - Delaware' },
  { abbr: 'DC', label: 'DC - District' },
  { abbr: 'FL', label: 'FL - Florida' },
  { abbr: 'GA', label: 'GA - Georgia' },
  { abbr: 'GU', label: 'GU - Guam' },
  { abbr: 'HI', label: 'HI - Hawaii' },
  { abbr: 'ID', label: 'ID - Idaho' },
  { abbr: 'IL', label: 'IL - Illinois' },
  { abbr: 'IN', label: 'IN - Indiana' },
  { abbr: 'IA', label: 'IA - Iowa' },
  { abbr: 'KS', label: 'KS - Kansas' },
  { abbr: 'KY', label: 'KY - Kentucky' },
  { abbr: 'LA', label: 'LA - Louisiana' },
  { abbr: 'ME', label: 'ME - Maine' },
  { abbr: 'MD', label: 'MD - Maryland' },
  { abbr: 'MA', label: 'MA - Massachusetts' },
  { abbr: 'MI', label: 'MI - Michigan' },
  { abbr: 'MN', label: 'MN - Minnesota' },
  { abbr: 'MS', label: 'MS - Mississippi' },
  { abbr: 'MO', label: 'MO - Missouri' },
  { abbr: 'MT', label: 'MT - Montana' },
  { abbr: 'NE', label: 'NE - Nebraska' },
  { abbr: 'NV', label: 'NV - Nevada' },
  { abbr: 'NH', label: 'NH - New' },
  { abbr: 'NJ', label: 'NJ - New' },
  { abbr: 'NM', label: 'NM - New' },
  { abbr: 'NY', label: 'NY - New' },
  { abbr: 'NC', label: 'NC - North' },
  { abbr: 'ND', label: 'ND - North' },
  { abbr: 'MP', label: 'MP - Northern' },
  { abbr: 'OH', label: 'OH - Ohio' },
  { abbr: 'OK', label: 'OK - Oklahoma' },
  { abbr: 'OR', label: 'OR - Oregon' },
  { abbr: 'PA', label: 'PA - Pennsylvania' },
  { abbr: 'PR', label: 'PR - Puerto' },
  { abbr: 'RI', label: 'RI - Rhode' },
  { abbr: 'SC', label: 'SC - South' },
  { abbr: 'SD', label: 'SD - South' },
  { abbr: 'TN', label: 'TN - Tennessee' },
  { abbr: 'TX', label: 'TX - Texas' },
  { abbr: 'UM', label: 'UM - United' },
  { abbr: 'UT', label: 'UT - Utah' },
  { abbr: 'VT', label: 'VT - Vermont' },
  { abbr: 'VI', label: 'VI - Virgin' },
  { abbr: 'VA', label: 'VA - Virginia' },
  { abbr: 'WA', label: 'WA - Washington' },
  { abbr: 'WV', label: 'WV - West' },
  { abbr: 'WI', label: 'WI - Wisconsin' },
  { abbr: 'WY', label: 'WY - Wyoming' },
  { abbr: 'AA', label: 'AA - Armed Forces Americas' },
  { abbr: 'AE', label: 'AE - Armed Forces Africa' },
  { abbr: 'AE', label: 'AE - Armed Forces Canada' },
  { abbr: 'AE', label: 'AE - Armed Forces Europe' },
  { abbr: 'AE', label: 'AE - Armed Forces Middle East' },
  { abbr: 'AP', label: 'AP - Armed Forces Pacific' },
] as const;

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
        <div style={{ padding: '10px' }}>
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
      physicalStreetAddress: {
        ...baseChildProps.physicalStreetAddress,
        error: {
          type: 'custom',
          message: 'Test - Wrong street address',
        },
      },
      physicalZipCode: {
        ...baseChildProps.physicalZipCode,
        error: {
          type: 'custom',
          message: 'Test - Wrong zip code',
        },
      },
    },
    error: {
      physical: {
        type: 'custom',
        message: 'This field has an error',
      },
      mailing: {
        type: 'custom',
        message: 'This field has an error',
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
