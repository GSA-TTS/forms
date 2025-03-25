#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { FormsPipelineStack } from '../lib/pipeline-stack';
import { FormsPlatformStack } from '../lib/platform-stack';

const app = new cdk.App();
new FormsPlatformStack(app, 'FormsPlatformStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
new FormsPipelineStack(app, 'FormsPipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
