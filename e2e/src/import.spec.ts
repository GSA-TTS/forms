import { test, expect } from './fixtures/import-file.fixture.js';
import { FormCreatePage } from './models/form-create-page.js';

test.describe('Import form from a provided sample', () => {
  let formPage: FormCreatePage;
  let formUrl: string;

  test.beforeEach(async ({ page, formUrl: url }) => {
    formPage = new FormCreatePage(page);
    formUrl = url;
    await formPage.navigateTo(formUrl);
  });

  test('Verify the form import was successful', async () => {
    await formPage.verifyBlueprintLoaded();
  });

  test('Edit page title', async () => {
    await formPage.editPageTitle('Pardon Application *', 'My awesome form page');
  });

  test('Add a rich text component and format text', async () => {
    const editorText = 'This is some text entered in the rich text editor';
    await formPage.addRichTextComponent(editorText);
  });

  test('Move question to another page', async ({ page, formUrl }) => {
    const destinationPage = 'Charge Details';
    await formPage.navigateTo(`${formUrl}?page=8`);
    await formPage.moveQuestionToPage('Race', destinationPage);
    await expect(page.getByText('Element moved successfully.')).toBeVisible();
    await formPage.navigateTo(`${formUrl}?page=4`);
    await formPage.keyboardEnter();
    expect(page.getByText('Name:')).toBeDefined();
  });

  test('Delete a question/pattern', async ({ formUrl }) => {
    await formPage.navigateTo(`${formUrl}?page=11`);
    await formPage.confirmDialog();
    await formPage.deletePattern('Page 3 of 4');
  });

  test('Reorder pages via drag-and-drop', async ({ page }) => {
    const getPageMenuLinks = (links: (SVGElement | HTMLElement)[]) => links.map((link) => link.textContent?.trim() || '');
    const menuSelector = 'ul.add-list-reset a';
    await page.waitForSelector(menuSelector, { state: 'visible' });

    const startOrder = await page.$$eval(menuSelector, getPageMenuLinks);

    await expect(startOrder.length).toBeGreaterThan(1);

    const element1BoundingBox = await page.getByRole('listitem').filter({ hasText: `Move this item${startOrder[0]}` }).getByRole('button')?.boundingBox();
    const element2BoundingBox = await page.getByRole('listitem').filter({ hasText: `Move this item${startOrder[1]}` })?.boundingBox();

    const startX = element1BoundingBox.x + element1BoundingBox.width / 2;
    const startY = element1BoundingBox.y + element1BoundingBox.height / 2;
    const endY = element2BoundingBox.y + element2BoundingBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX, endY);
    await page.mouse.up();

    const endOrder = await page.$$eval(menuSelector, getPageMenuLinks);

    expect(startOrder).not.toEqual(endOrder);
  });
});
