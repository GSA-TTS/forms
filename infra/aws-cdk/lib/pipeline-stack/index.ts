import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';

import * as ecr_repository from './ecr-repository';
import { FormsEcrRepository } from './ecr-repository';

export class FormsPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Read a parameter called "testparameter" from the stack
    const codeConnectionArnParam = new cdk.CfnParameter(this, 'codeConnectionArn', {
      type: 'String',
      description:
        "ARN for the source repository's AWS CodeConnection configuration",
      allowedPattern: '.+',
    });
    const codeConnectionArn = codeConnectionArnParam.valueAsString

    // Create the ECR repository
    console.log('Creating ECR repository...');
    const ecrRepo = new FormsEcrRepository(this, 'FormsEcrRepositoryConstruct');

    // Build CodeBuild Project: Builds & pushes Docker image
    console.log('Creating CodeBuild project...');
    const dockerBuild = new codebuild.PipelineProject(
      this,
      'FormsBuildProject',
      {
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
          privileged: true, // Required for Docker
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: {
              commands: [
                'echo "Logging in to AWS ECR..."',
                'aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com',
                'echo "Building Docker image..."',
                'echo ${REPO_URI}',
                'cd ${CODEBUILD_SRC_DIR}/server',
                'docker build -t ${REPO_URI}:latest .',
                'IMAGE_TAG=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)',
                'docker tag ${REPO_URI}:latest ${REPO_URI}:${IMAGE_TAG}',
                'echo "Pushing Docker images..."',
                'docker push ${REPO_URI}:latest',
                'docker push ${REPO_URI}:${IMAGE_TAG}',
              ],
            },
          },
        }),
        environmentVariables: {
          REPO_URI: { value: ecrRepo.repository.repositoryUri },
          AWS_ACCOUNT_ID: { value: cdk.Aws.ACCOUNT_ID },
          AWS_REGION: { value: cdk.Aws.REGION },
        },
      }
    );

    // Define the pipeline
    console.log('Creating CodePipeline pipeline...');
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'FormsBuildImagePipeline',
    });
    pipeline.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['codestar-connections:UseConnection'],
        resources: [
          codeConnectionArn,
        ],
      })
    );
    ecrRepo.repository.grantPullPush(dockerBuild);
    const sourceArtifact = new codepipeline.Artifact();

    // Pull from GitHub
    console.log('Adding source stage...');
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeStarConnectionsSourceAction({
          actionName: 'GitHub_Source',
          owner: 'GSA-TTS',
          repo: 'forms-doj-stack',
          branch: 'main',
          connectionArn: codeConnectionArn,
          output: sourceArtifact,
        }),
      ],
    });

    // Build and publish Docker image
    console.log('Adding build stage...');
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'DockerBuildPush',
          project: dockerBuild,
          input: sourceArtifact,
        }),
      ],
    });

    //this.addDeployStage(pipeline, ecrRepo, sourceArtifact);
  }

  private addDeployStage(pipeline: codepipeline.Pipeline, ecrRepo: ecr_repository.FormsEcrRepository, sourceArtifact: codepipeline.Artifact) {
    const cloudAssemblyArtifact = new codepipeline.Artifact();
    // CodeBuild Project for CDK Synth
    console.log('Adding deploy stack CodeBuild pipeline project...');
    const deployStack = new codebuild.PipelineProject(
      this,
      'DeployFormsPlatformStackProject',
      {
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
          privileged: true,
        },
        environmentVariables: {
          TAG_OR_DIGEST: { value: 'latest' },
          REPO_NAME: { value: ecrRepo.repository.repositoryUri },
          ENVIRONMENT: { value: 'dev' },
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              'runtime-versions': {
                nodejs: '22',
              },
              commands: [
                'cd server',
                'npm install -g corepack@latest',
                'corepack enable && corepack prepare pnpm@latest --activate',
                'pnpm install',
              ],
            },
            build: {
              commands: [
                'cd node_modules/@gsa-tts/forms-infra-aws-cdk',
                'pnpm cdk deploy --ci FormsPlatformStack --parameters "tagOrDigest=${TAG_OR_DIGEST}" --parameters "environment=${ENVIRONMENT}" --parameters "repositoryName=${REPO_NAME}"',
              ],
            },
          },
          artifacts: {
            'base-directory': 'cdk.out',
            files: '**/*',
          },
        }),
      }
    );

    // Build Stage (Synth)
    console.log('Adding Deploy stage...');
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'DeployFormsPlatformStack',
          project: deployStack,
          input: sourceArtifact,
          outputs: [cloudAssemblyArtifact],
        }),
      ],
    });
  }
}
