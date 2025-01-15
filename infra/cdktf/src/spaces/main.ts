import { execSync } from 'child_process';

import { registerAppStack } from '../lib/app-stack';

const gitCommitHash = execSync('git rev-parse HEAD').toString().trim();
registerAppStack('tts-10x-forms-dev', gitCommitHash);
