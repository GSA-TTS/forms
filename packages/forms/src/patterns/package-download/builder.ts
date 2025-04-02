import { type PackageDownloadPattern } from '.';
import { PatternBuilder } from '../../pattern';

export class PackageDownload extends PatternBuilder<PackageDownloadPattern> {
  type = 'package-download';
}
