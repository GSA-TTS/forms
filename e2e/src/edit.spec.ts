import { expect, test, Page } from '@playwright/test';
import { BASE_URL } from './constants';

interface PageDataTest {
  title: string;
  pattern?: Array<string>;
}

class TestPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async setLocalStorage(key: string, value: any) {
    await this.page.context().addInitScript(
      ([key, value]) => {
        localStorage.setItem(key, value);
      },
      [key, JSON.stringify(value)]
    );
  }
  async moveListItem(buttonText: string, pageTitles: string[]) {
    const handle = this.page
      .locator('li')
      .filter({ hasText: `${buttonText}${pageTitles[0]}` })
      .getByRole('button');
    await handle.hover();
    await this.page.mouse.down();
    const nextElement = this.page
      .locator('li')
      .filter({ hasText: `${buttonText}${pageTitles[1]}` })
      .getByRole('button');
    await nextElement.hover();
    await this.page.mouse.up();
  }
  async checkFirstUrl(path: string) {
    const firstUrl = new URL(this.page.url());
    expect(firstUrl.hash.indexOf(path)).toEqual(-1);
  }
  async checkNextUrl(path: string) {
    const nextUrl = new URL(this.page.url());
    expect(nextUrl.hash.indexOf(path)).not.toEqual(-1);
  }
}

const preparePageTitles = (items: any) => {
  return Object.values(items)
    .filter(item => item.type === 'page')
    .map(item => (item.data as PageDataTest).title);
};

const prepareUpdatedPageTitles = (items: string[]) => {
  const newFirstItem = items.shift();
  return items.splice(1, 0, newFirstItem || '');
};

test('Drag-and-drop pages via mouse interaction', async ({ context, page }) => {
  const key = 'forms/62ba7264-e869-40fc-ac68-5892f1228a9b';
  const obj = {
    summary: {
      title: 'My form - 2024-07-10T20:20:08.037Z',
      description: '',
    },
    root: 'root',
    patterns: {
      root: {
        type: 'page-set',
        id: 'root',
        data: {
          pages: [
            'cbd810ef-fd29-48f6-901b-fa88ab4f4100',
            '5e4381b5-c05e-4471-ba1c-cd4ff045ab74',
            'aca1a6a4-e7ba-4f37-bdf1-2726aa40831a',
          ],
        },
      },
      'cbd810ef-fd29-48f6-901b-fa88ab4f4100': {
        type: 'page',
        id: 'cbd810ef-fd29-48f6-901b-fa88ab4f4100',
        data: {
          title: 'Page 1',
          patterns: [],
        },
      },
      '5e4381b5-c05e-4471-ba1c-cd4ff045ab74': {
        id: '5e4381b5-c05e-4471-ba1c-cd4ff045ab74',
        type: 'page',
        data: {
          title: 'A new page',
          patterns: [],
        },
      },
      'aca1a6a4-e7ba-4f37-bdf1-2726aa40831a': {
        id: 'aca1a6a4-e7ba-4f37-bdf1-2726aa40831a',
        type: 'page',
        data: {
          title: 'Different Page',
          patterns: [],
        },
      },
    },
    outputs: [],
  };
  const testPage = new TestPage(page);
  await testPage.setLocalStorage(key, obj);
  const pageTitles = preparePageTitles(obj.patterns);

  await page.goto(`${BASE_URL}`);
  await page.getByRole('link', { name: 'Edit' }).click();
  const buttonText = 'Move this item';

  await testPage.checkFirstUrl('?page=');
  await testPage.moveListItem(buttonText, pageTitles);

  await page.waitForFunction(
    ([pageTitles, buttonText]) => {
      const items = document.querySelectorAll(
        '.usa-sidenav .draggable-list-item-wrapper'
      );
      return (
        (items[0] as HTMLElement).innerText ===
          buttonText + '\n' + pageTitles[1] && items.length === 3
      );
    },
    [pageTitles, buttonText]
  );

  const pageTitlesCopy = [...pageTitles];
  const newPageTitles = prepareUpdatedPageTitles(pageTitlesCopy);

  const reorderedFirst = page
    .locator('ul')
    .filter({ hasText: buttonText + newPageTitles.join(buttonText) })
    .getByRole('button')
    .first();

  await expect(reorderedFirst).toBeVisible();
  await testPage.checkNextUrl('?page=1');
});
