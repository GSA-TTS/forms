import type { ParsePdf } from '../documents/index.js';
import type { FormConfig } from '../pattern.js';
import type { FormRepository } from '../repository/index.js';

export { BrowserFormRepository } from './browser/form-repo.js';
export { createTestBrowserFormService } from './test/index.js';

export type FormServiceContext = {
  repository: FormRepository;
  config: FormConfig;
  isUserLoggedIn: () => boolean;
  parsePdf: ParsePdf;
};
