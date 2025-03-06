import { execSync } from 'child_process';

import { registerAppStack } from '../lib/app-stack';

const gitRef =
  process.env.DEPLOY_GIT_REF ||
  execSync('git rev-parse HEAD').toString().trim();

registerAppStack('tts-10x-forms-demo', gitRef);
