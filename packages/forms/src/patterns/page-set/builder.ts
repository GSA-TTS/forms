import { type Blueprint } from '../..';
import { PatternBuilder } from '../../pattern';
import { type Page } from '../page/builder';
import { type PageSetPattern } from './config';

export class Form {
  constructor(public readonly blueprint: Blueprint) {}
}

export class PageSet extends PatternBuilder<PageSetPattern> {
  addPage(page: Page) {
    return new PageSet({
      ...this.data,
      pages: [...this.data.pages, page.id],
    });
  }

  toPattern(): PageSetPattern {
    return {
      id: this.id,
      type: 'page-set',
      data: this.data,
    };
  }
}
