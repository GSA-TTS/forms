import { PatternBuilder } from '../../pattern';
import { type InputPattern } from './config';

export class Input extends PatternBuilder<InputPattern> {
  type = 'input';
}
