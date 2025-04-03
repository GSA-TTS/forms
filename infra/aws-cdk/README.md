# forms-infra-aws-cdk

This package implements an AWS CDK project, including a build process to compile a Cloudformation template.

## Commands

### Build

Before creating or updating a stack, you must first build the stack.

```bash
pnpm build
```

### Create stack

```bash
#forms-apply-stack -r <region> -e <environment-identifier>
cd node_modules/@gsa-tts/forms-infra-aws-cdk
pnpm cdk deploy \
  --ci FormsPlatformStack \
  --parameters "tagOrDigest=${TAG_OR_DIGEST}" \
  --parameters "environment=${ENVIRONMENT}" \
  --parameters "repositoryName=${REPO_NAME}"
```

### Deploy

To deploy a new image, you must publish to ECR.
