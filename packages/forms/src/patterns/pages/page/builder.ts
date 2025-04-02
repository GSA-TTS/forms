import { PatternBuilder } from '../../../pattern';
import { type PagePattern } from './config';

export class Page extends PatternBuilder<PagePattern> {
  type = 'page';

  setTitle(title: string) {
    return new Page({
      ...this.data,
      title,
    });
  }
}
