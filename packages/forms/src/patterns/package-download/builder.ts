import { type PackageDownloadPattern } from '.';
import { PatternBuilder } from '../../pattern';

export class PackageDownload extends PatternBuilder<PackageDownloadPattern> {
  toPattern(): PackageDownloadPattern {
    return {
      id: this.id,
      type: 'page-set',
      data: this.data,
    };
  }
}
