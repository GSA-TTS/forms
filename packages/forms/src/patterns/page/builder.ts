import { PatternBuilder } from '../../pattern';
import { type PagePattern } from './config';

export class Page extends PatternBuilder<PagePattern> {
  setTitle(title: string) {
    return new Page({
      ...this.data,
      title,
    });
  }

  toPattern(): PagePattern {
    return {
      id: this.id,
      type: 'page',
      data: this.data,
    };
  }
}
