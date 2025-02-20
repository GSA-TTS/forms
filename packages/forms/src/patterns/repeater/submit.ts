import { success } from '@gsa-tts/forms-common';

import { type RepeaterPattern } from '../..';
import { type SubmitHandler } from '../../submission';

export const repeaterAddRowHandler: SubmitHandler<RepeaterPattern> = async (
  context,
  opts
) => {
  const currentData = opts.session.data.values[opts.pattern.id];
  const repeaterPatternData = Array.isArray(currentData)
    ? currentData
    : Array.isArray(currentData?.[opts.pattern.id])
      ? currentData[opts.pattern.id]
      : [];

  const initialRepeaterRowData = opts.pattern.data.patterns.reduce(
    (acc, patternId: string) => {
      // THIS requires all the patterns to have object not string input values
      // acc[patternId] = {};

      return acc;
    },
    {} as Record<string, any>
  );

  console.log('New Row Data:', initialRepeaterRowData);

  // If this is the first add (repeaterPatternData is empty), add two rows
  // Otherwise add just one row
  const rowsToAdd = repeaterPatternData.length === 0 ? 2 : 1;

  const newRows = Array(rowsToAdd).fill(initialRepeaterRowData);

  const newValues = {
    ...opts.session.data.values,
    [opts.pattern.id]: Object.freeze([...repeaterPatternData, ...newRows]),
  };

  console.log('TEST newValues in submit', newValues);
  // Only create new session object if values actually changed
  if (
    opts.session.data.values[opts.pattern.id] !== newValues[opts.pattern.id]
  ) {
    return success({
      session: {
        ...opts.session,
        data: {
          ...opts.session.data,
          values: newValues,
          lastAction: opts.data.action,
        },
      },
    });
  }

  return success({ session: opts.session });
};

export const repeaterDeleteRowHandler: SubmitHandler<RepeaterPattern> = async (
  context,
  opts
) => {
  const indexToDelete = parseInt(opts.data.deleteIndex || '0', 10);
  const repeaterPatternData = opts.session.data.values[opts.pattern.id] || [];

  // Only proceed if there's actually something to delete
  if (indexToDelete >= repeaterPatternData.length) {
    return success({ session: opts.session });
  }

  const updatedRepeaterData = repeaterPatternData.filter(
    (_: any, index: number) => index !== indexToDelete
  );

  const childPatternIds = opts.pattern.data.patterns.map(
    patternId => `${opts.pattern.id}.${indexToDelete}`
  );

  const newValues = { ...opts.session.data.values };

  // Only delete keys that actually exist
  const keysToDelete = Object.keys(newValues).filter(key =>
    childPatternIds.some(prefix => key.startsWith(prefix))
  );

  if (keysToDelete.length > 0) {
    keysToDelete.forEach(key => {
      delete newValues[key];
    });
  }

  newValues[opts.pattern.id] = Object.freeze(updatedRepeaterData);

  // Only create new session if data actually changed
  if (JSON.stringify(opts.session.data.values) !== JSON.stringify(newValues)) {
    return success({
      session: {
        ...opts.session,
        data: {
          ...opts.session.data,
          values: newValues,
          lastAction: opts.data.action,
        },
      },
    });
  }

  return success({ session: opts.session });
};
