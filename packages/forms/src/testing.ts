import { type DatabaseContext } from '@atj/database';
import { createInMemoryDatabaseContext } from '@atj/database/context';
import { createFormsRepository } from './repository';
import { defaultFormConfig } from './patterns';

type Options = {
  isUserLoggedIn: () => boolean;
};

export const createTestFormServiceContext = async (opts?: Partial<Options>) => {
  const db: DatabaseContext = await createInMemoryDatabaseContext();
  const repository = createFormsRepository(db);
  return {
    db,
    repository,
    config: defaultFormConfig,
    isUserLoggedIn: opts?.isUserLoggedIn || (() => true),
  };
};

export type TestFormServiceContext = Awaited<
  ReturnType<typeof createTestFormServiceContext>
>;
