import { type AuthServiceContext } from '@atj/auth';
import { type FormConfig, type FormService } from '@atj/forms';

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
