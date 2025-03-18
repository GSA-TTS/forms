import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr_repository from './ecr-repository';

export class FormsPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the ECR repository
    const ecrRepo = new ecr_repository.FormsEcrRepository(
      this,
      'FormsEcrRepository'
    );
    // Build CodeBuild Project: Builds & pushes Docker image
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
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'FormsBuildImagePipeline',
    });
    ecrRepo.repository.grantPullPush(dockerBuild);
    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    // Pull from GitHub
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeStarConnectionsSourceAction({
          actionName: 'GitHub_Source',
          owner: 'GSA-TTS',
          repo: 'forms-doj-stack',
          branch: 'main',
          connectionArn:
            'arn:aws:codeconnections:us-east-2:001907687576:connection/0415c419-d556-46cf-91d9-226dfa88d71b',
          output: sourceArtifact,
        }),
      ],
    });

    // Build and publish Docker image
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

    // CodeBuild Project for CDK Synth
    const deployStack = new codebuild.PipelineProject(
      this,
      'DeployFormsPlatformStackProject',
      {
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
          privileged: true,
        },
        environmentVariables: {
          IMAGE_URI: { value: ecrRepo.repository.repositoryUri },
          ENVIRONMENT: { value: 'dev' },
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            install: {
              commands: ['cd server', 'pnpm install'],
            },
            build: {
              commands: [
                'cd node_modules/@gsa-tts/forms-infra-aws-cdk',
                'pnpm cdk deploy --ci FormsPlatformStack ----parameters imageUri=${IMAGE_URI} --parameters environment=${ENVIRONMENT}',
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
