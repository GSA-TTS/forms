import { test, expect, Page } from '@playwright/test';
import { GuidedFormCreation, Create } from '../../packages/design/src/FormManager/routes';
import { BASE_URL } from './constants';
import { pathToRegexp } from 'path-to-regexp';

const createNewForm = async (page: Page) => {
  await page.goto(`${BASE_URL}/${GuidedFormCreation.getUrl()}`);
  await page.getByRole('button', { name: 'Create New' }).click();
}

const addQuestions = async (page: Page) => {
  const menuButton = page.getByRole('button', { name: 'Add element', exact: true });
  
  await menuButton.click();
  await page.getByRole('button', { name: 'Short answer' }).click();
  const fieldLabel = page.locator('.usa-label', { hasText: 'Field label' })
  await fieldLabel.fill('Short answer label');

  await menuButton.click();
  await page.getByRole('button', { name: 'Multiple choice' }).click();
  const fieldLabel2 = page.locator('.usa-label', { hasText: 'Question text' })
  await fieldLabel2.fill('Multiple choice question label');

  await page.getByRole('button', { name: 'Save' }).click();
}

test('Create form from scratch', async ({ page }) => {
  const { regexp } = pathToRegexp(Create.path);
  await createNewForm(page);
  let pageUrl = page.url();
  let pagePath = '';

  if(Create.getUrl().indexOf('#') === 0) {
    const parts = pageUrl.split('#');
    if(parts.length === 2) {
      pagePath = parts[1];
    }
  } else {
    pagePath = new URL(pageUrl).pathname;
  }

  expect(regexp.test(pagePath)).toBe(true);
});

test('Add questions', async ({ page }) => {
  await createNewForm(page);
  await addQuestions(page);
  
  const element1 = page.locator('.usa-label', { hasText: 'Short answer label'});
  const element2 = page.locator('.usa-legend', { hasText: 'Multiple choice question label' });

  expect(element1.first()).toBeTruthy();
  expect(element2.first()).toBeTruthy();

  const element1Box = await element1.first().boundingBox();
  const element2Box = await element2.first().boundingBox();

  expect(element1Box).not.toBeNull();
  expect(element2Box).not.toBeNull();

  // Compare the vertical positions of the elements
  expect(element1Box!.y).toBeLessThan(element2Box!.y);
});

test('Drag-and-drop questions via mouse interaction', async ({ page }) => {
  await createNewForm(page);
  await addQuestions(page);

  // Locate the handle for the first draggable item
  const handle = page.locator('[aria-describedby="DndDescribedBy-1"]').first();
  await handle.hover();
  await page.mouse.down();

  // Locate the target position for the drag-and-drop action
  const nextElement = page.locator('.draggable-list-item-wrapper').nth(2);
  const nextElementBox = await nextElement.boundingBox();
  if (nextElementBox) {
    await page.mouse.move(nextElementBox.x + nextElementBox.width / 2, nextElementBox.y + nextElementBox.height / 2);
  }
  await page.mouse.up();
  await nextElement.hover();

  // Verify that the drag-and-drop action has completed
  await expect(page.locator('.draggable-list-item-wrapper').nth(2)).toContainText('Short answer label');
  await expect(page.locator('.draggable-list-item-wrapper').nth(1)).toContainText('Multiple choice question label');
});
