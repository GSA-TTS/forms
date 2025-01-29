import { PatternBuilder } from '../../../pattern';
import { type Page } from '../page/builder';
import { type PageSetPattern } from './config';

export class PageSet extends PatternBuilder<PageSetPattern> {
  type = 'page-set';

  addPage(page: Page) {
    return new PageSet({
      ...this.data,
      pages: [...this.data.pages, page.id],
    });
  }
}
