import { describe, expect, it } from 'vitest';
import { addressConfig, type AddressPattern } from './index';
import { createAddressSchema } from './index';

describe('AddressPattern tests', () => {
  describe('AddressSchema', () => {
    it('should validate a complete and correct address', () => {
      const validInput = {
        physicalStreetAddress: '123 Main St',
        physicalStreetAddress2: 'Apt 4B',
        physicalCity: 'Anytown',
        physicalStateTerritoryOrMilitaryPost: 'CA',
        physicalZipCode: '12345',
        physicalUrbanizationCode: 'URB123',
        physicalGooglePlusCode: 'GPCODE',
        mailingStreetAddress: '123 Main St',
        mailingStreetAddress2: 'Apt 4B',
        mailingCity: 'Anytown',
        mailingStateTerritoryOrMilitaryPost: 'CA',
        mailingZipCode: '12345',
        mailingUrbanizationCode: 'URB123',
      };

      const schema = createAddressSchema({ legend: 'Default', required: true });
      expect(schema.safeParse(validInput).success).toBe(true);
    });

    it('should fail validation for an incomplete address', () => {
      const invalidInput = {
        physicalStreetAddress: '',
        physicalCity: '',
        physicalStateTerritoryOrMilitaryPost: '',
        physicalZipCode: '',
        mailingStreetAddress: '',
        mailingCity: '',
        mailingStateTerritoryOrMilitaryPost: '',
        mailingZipCode: '',
      };

      const schema = createAddressSchema({ legend: 'Default', required: true });
      expect(schema.safeParse(invalidInput).success).toBe(false);
    });
  });

  describe('addressConfig', () => {
    it('should handle validation error for user input', () => {
      const pattern: AddressPattern = {
        type: 'address',
        id: 'test-address',
        data: {
          legend: 'Test Address',
          required: true,
          addMailingAddress: true,
        },
      };

      const inputValue = {
        physicalStreetAddress: '',
        physicalCity: '',
        physicalStateTerritoryOrMilitaryPost: '',
        physicalZipCode: '',
        mailingStreetAddress: '',
        mailingCity: '',
        mailingStateTerritoryOrMilitaryPost: '',
        mailingZipCode: '',
      };

      const result = addressConfig.parseUserInput!(pattern, inputValue);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });

    it('should parse config data correctly', () => {
      const obj = {
        legend: 'Test Address Legend',
        required: true,
        addMailingAddress: true,
      };

      const result = addressConfig.parseConfigData(obj);
      if (result.success) {
        expect(result.data.legend).toBe('Test Address Legend');
        expect(result.data.required).toBe(true);
        expect(result.data.addMailingAddress).toBe(true);
      } else {
        expect.fail('Unexpected validation failure');
      }
    });

    it('should handle invalid config data', () => {
      const obj = {
        legend: '',
        required: true,
        addMailingAddress: true,
      };

      const result = addressConfig.parseConfigData(obj);
      if (!result.success) {
        expect(result.error).toBeDefined();
      } else {
        expect.fail('Unexpected validation success');
      }
    });
  });
});
