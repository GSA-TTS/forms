import { PatternBuilder } from '../../pattern';
import type { FieldsetPattern } from './config';

export class FieldSet extends PatternBuilder<FieldsetPattern> {
  type = 'fieldset';
}
