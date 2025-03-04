# @gsa-tts/forms-infra

Infrastructure-as-code (IaC) for the project, implemented with [Terraform CDK](https://github.com/hashicorp/terraform-cdk).

## Deployment steps

To prepare for deployment, first build the project:

```bash
pnpm build
```

To perform a deployment, ensure the current environment is configured with credentials for AWS and Cloud.gov (see below for details). Then, you may deploy with:

```bash
pnpm deploy
```

## Cloud services

### AWS

The Terraform state is maintained in an AWS S3 bucket. Also, some experimental integrations have at times been deployed to AWS. In order to apply the Terraform, you must have appropriate AWS credentials in your current environment.

### Cloud.gov

The project team intends to default to deploying infrastructure to Cloud.gov. The

Interacting with cloud.gov requires login via the Cloudfoundry CLI:

```bash
cf login -a api.fr.cloud.gov --sso
```

cloud.gov operations may be bootstrapped with `./scripts/cloud.sh`.

```bash
./scripts/cloud.sh -h
```

To initialize a deployment space and create a service account for deployments:

```bash
./scripts/cloud.sh setup -o <organization-name> -s <space-name>
```

To view the credentials:

```bash
./scripts/cloud.sh show -o <organization-name> -s <space-name>
```

To export the deploy user's credentials to your environment:

```bash
source ./scripts/cloud.sh export -o <organization-name> -s <space-name>
```

Once the credentials are exported to the environment, you may utilize them via the Terraform CDK project.
