import { test as base, expect } from '@playwright/test';
import { pathToRegexp } from 'path-to-regexp';
import { Create, GuidedFormCreation } from '../../../packages/design/src/FormManager/routes';
import { BASE_URL } from '../constants';

export type FormImportFixture = {
  formUrl: string;
};

const test = base.extend<FormImportFixture>({
  formUrl: async ({ page }, use) => {
    const { regexp } = pathToRegexp(Create.path);
    await page.goto(`${BASE_URL}/${GuidedFormCreation.getUrl()}`);
    await page.getByText('Or use an example file,').click();
    await page.getByRole('button', { name: 'sample-documents/doj-pardon-' }).click();

    await page.waitForURL((url) => {
      const pagePath = url.hash.startsWith('#') ? url.hash.substring(1) : url.pathname;
      return regexp.test(pagePath);
    });

    const generatedFormUrl = page.url();
    await use(generatedFormUrl);
  },
});

export { test, expect };

