import { BrowserFormRepository } from '../browser/form-repo.js';
import { parsePdf } from '../../documents/pdf/index.js';
import { defaultFormConfig } from '../../patterns/index.js';
import { type FormService, createFormService } from '../../services/index.js';

import { createTestStorage, type TestData } from './storage.js';

// In tests, use the browser form service with fakes injected.
export const createTestBrowserFormService = (
  testData: TestData = {}
): FormService => {
  const storage = createTestStorage(testData);
  const repository = new BrowserFormRepository(storage);
  const formService = createFormService({
    repository,
    config: defaultFormConfig,
    isUserLoggedIn: () => true,
    parsePdf,
  });
  if (testData) {
    Object.entries(testData).forEach(([id, blueprint]) => {
      formService.saveForm(id, blueprint);
    });
  }
  return formService;
};
