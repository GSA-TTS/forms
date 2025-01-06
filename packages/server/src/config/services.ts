import {
  type FormService,
  createFormService,
  createFormsRepository,
  defaultFormConfig,
  parsePdf,
} from '@atj/forms';
import { type ServerOptions } from './options.js';

export const createServerFormService = (
  options: ServerOptions,
  ctx: { isUserLoggedIn: () => boolean }
): FormService => {
  return createFormService({
    repository: createFormsRepository({
      db: options.db,
      formConfig: defaultFormConfig,
    }),
    config: defaultFormConfig,
    isUserLoggedIn: ctx.isUserLoggedIn,
    parsePdf,
  });
};
