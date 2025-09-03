import { type FormConfig, type FormService } from '@gsa-tts/forms-core';
import { type ComponentForPattern } from '../Form/types.js';
import { type EditComponentForPattern } from './FormEdit/types.js';
import { UrlForForm, UrlForFormManager } from '../AvailableFormList/index.js';

export type PatternLessFormManagerContext = {
  baseUrl: `${string}/`;
  formService: FormService;
  uswdsRoot: `${string}/`;
  urlForForm: UrlForForm;
  urlForFormManager: UrlForFormManager;
};

export type FormManagerContext = PatternLessFormManagerContext & {
  config: FormConfig;
  components: ComponentForPattern;
  editComponents: EditComponentForPattern;
};

export type FormManagerProps = {
  context: PatternLessFormManagerContext;
};
