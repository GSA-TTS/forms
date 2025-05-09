import { type PatternComponent } from '../../types.js';
import { renderPromptComponents } from '../../form-common.js';

const Sequence: PatternComponent = props => {
  return renderPromptComponents(props.context, props.childComponents);
};

export default Sequence;
