import { beforeAll, describe, expect, it } from 'vitest';

import { type Failure, type Success } from '@gsa-tts/forms-common';

import { fillPDF } from '../index.js';
import { loadSamplePDF } from './sample-data.js';
import { getDocumentFieldData } from '../pdf/extract.js';

describe('PDF form filler', () => {
  let pdfBytes: Uint8Array;

  beforeAll(async () => {
    pdfBytes = await loadSamplePDF('dod_character.pdf');
  });

  it('generates pdf from valid form data', async () => {
    const pdfBytes = await loadSamplePDF('dod_character.pdf');

    const result = (await fillPDF(pdfBytes, {
      'CharacterName 2': { type: 'TextField', value: 'nameField' },
      'Feat+Traits': { type: 'TextField', value: 'traitsField' },
      Age: { type: 'TextField', value: 'ageField' },
      Allies: { type: 'TextField', value: 'alliesField' },
      Backstory: { type: 'TextField', value: 'backStoryField' },
      Eyes: { type: 'TextField', value: 'eyesField' },
      FactionName: { type: 'TextField', value: 'factionField' },
      Hair: { type: 'TextField', value: 'hairField' },
      Height: { type: 'TextField', value: 'heightField' },
      Skin: { type: 'TextField', value: 'skinField' },
      Treasure: { type: 'TextField', value: 'treasureField' },
      Weight: { type: 'TextField', value: 'weightField' },
    })) as Success<Uint8Array>;
    expect(result.success).toEqual(true);
    const fields = await getDocumentFieldData(result.data);
    expect(fields).toEqual({
      Q2hhcmFjdGVyTmFtZSAy: {
        type: 'TextField',
        name: 'CharacterName 2',
        label: 'CharacterName 2',
        maxLength: undefined,
        value: 'nameField',
        required: false,
      },
      QWdl: {
        type: 'TextField',
        name: 'Age',
        label: 'Age',
        maxLength: undefined,
        value: 'ageField',
        required: false,
      },
      SGVpZ2h0: {
        type: 'TextField',
        name: 'Height',
        label: 'Height',
        maxLength: undefined,
        value: 'heightField',
        required: false,
      },
      V2VpZ2h0: {
        type: 'TextField',
        name: 'Weight',
        label: 'Weight',
        maxLength: undefined,
        value: 'weightField',
        required: false,
      },
      'RXllcw==': {
        type: 'TextField',
        name: 'Eyes',
        label: 'Eyes',
        maxLength: undefined,
        value: 'eyesField',
        required: false,
      },
      'U2tpbg==': {
        type: 'TextField',
        name: 'Skin',
        label: 'Skin',
        maxLength: undefined,
        value: 'skinField',
        required: false,
      },
      'SGFpcg==': {
        type: 'TextField',
        name: 'Hair',
        label: 'Hair',
        maxLength: undefined,
        value: 'hairField',
        required: false,
      },
      QWxsaWVz: {
        type: 'TextField',
        name: 'Allies',
        label: 'Allies',
        maxLength: undefined,
        value: 'alliesField',
        required: false,
      },
      'RmFjdGlvbk5hbWU=': {
        type: 'TextField',
        name: 'FactionName',
        label: 'FactionName',
        maxLength: undefined,
        value: 'factionField',
        required: false,
      },
      QmFja3N0b3J5: {
        type: 'TextField',
        name: 'Backstory',
        label: 'Backstory',
        maxLength: undefined,
        value: 'backStoryField',
        required: false,
      },
      'RmVhdCtUcmFpdHM=': {
        type: 'TextField',
        name: 'Feat+Traits',
        label: 'Feat+Traits',
        maxLength: undefined,
        value: 'traitsField',
        required: false,
      },
      'VHJlYXN1cmU=': {
        type: 'TextField',
        name: 'Treasure',
        label: 'Treasure',
        maxLength: undefined,
        value: 'treasureField',
        required: false,
      },
      'Q0hBUkFDVEVSIElNQUdFLnVuZGVmaW5lZA==': {
        type: 'not-supported',
        name: 'CHARACTER IMAGE.undefined',
        error: 'unsupported type: PDFButton',
      },
      'RmFjdGlvbiBTeW1ib2wgSW1hZ2U=': {
        type: 'TextField',
        name: 'Faction Symbol Image',
        label: 'Faction Symbol Image',
        maxLength: undefined,
        value: '',
        required: false,
      },
    });
  });

  it('returns an error when provided a non-existent field', async () => {
    const pdfBytes = await loadSamplePDF('dod_character.pdf');

    const result = (await fillPDF(pdfBytes, {
      fakeField: {
        type: 'TextField',
        value: 'fake data',
      },
    })) as Failure<string>;
    expect(result.success).toEqual(false);
    expect(result.error).toEqual(
      'PDFDocument has no form field with the name "fakeField"'
    );
  });
});
