import { type AuthServiceContext } from '@gsa-tts/forms-auth';
import { type FormConfig, type FormService } from '@gsa-tts/forms-core';

import { type GithubRepository } from '../lib/github.js';

export type AppContext = {
  auth: AuthServiceContext;
  baseUrl: `${string}/`;
  formConfig: FormConfig;
  formService: FormService;
  github: GithubRepository;
  title: string;
  uswdsRoot: `${string}/`;
};
