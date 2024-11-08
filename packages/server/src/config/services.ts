import {
  type FormService,
  createFormService,
  createFormsRepository,
  defaultFormConfig,
} from '@atj/forms';
import { type ServerOptions } from './options.js';

export const createServerFormService = (
  options: ServerOptions,
  ctx: { isUserLoggedIn: () => boolean }
): FormService => {
  return createFormService({
    repository: createFormsRepository(options.db),
    config: defaultFormConfig,
    isUserLoggedIn: ctx.isUserLoggedIn,
  });
};
