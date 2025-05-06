import { test, expect } from './fixtures/import-file.fixture.js';
import { FormCreatePage } from './models/form-create-page.js';

test.describe('Form builder preview', () => {
  let formPage: FormCreatePage;
  let formUrl: string;

  test.beforeEach(async ({ page, formUrl: url }) => {
    formPage = new FormCreatePage(page);
    formUrl = url;
    await formPage.navigateTo(formUrl);
  });

  test('Preview navigation', async ({ page }) => {
    await page.getByRole('link', { name: 'Preview' }).click();
    expect(page.url()).toContain('preview');
    const nextPageIndex = 1;
    const menu = page.getByRole('navigation', { name: 'Section navigation' });
    await expect(menu).toBeVisible();
    const links = menu.getByRole('link');

    const numLinks = await links.count();
    await expect(page.getByRole('heading', { name: `${nextPageIndex} of ${numLinks}`})).toBeVisible();
    expect(numLinks).toBeGreaterThanOrEqual(nextPageIndex + 1);

    await links.nth(nextPageIndex).click();
    await expect(page.getByRole('heading', { name: `${nextPageIndex + 1} of ${numLinks}`})).toBeVisible();
  });
});
