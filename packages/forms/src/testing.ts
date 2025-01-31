import { type DatabaseContext } from '@gsa-tts/forms-database';
import { createInMemoryDatabaseContext } from '@gsa-tts/forms-database/context';

import type { FormServiceContext } from './context';
import { type ParsePdf, parsePdf } from './documents';
import { defaultFormConfig } from './patterns';
import { createFormsRepository } from './repository';

type Options = {
  isUserLoggedIn: () => boolean;
  parsedPdf: ParsePdf;
};

export const createTestFormServiceContext = async (
  opts?: Partial<Options>
): Promise<FormServiceContext> => {
  const db: DatabaseContext = await createInMemoryDatabaseContext();
  const repository = createFormsRepository({
    db,
    formConfig: defaultFormConfig,
  });
  return {
    repository,
    config: defaultFormConfig,
    isUserLoggedIn: opts?.isUserLoggedIn || (() => true),
    parsePdf: opts?.parsedPdf || parsePdf,
  };
};

export type TestFormServiceContext = Awaited<
  ReturnType<typeof createTestFormServiceContext>
>;
