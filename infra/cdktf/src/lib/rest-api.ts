import * as path from 'path';

import { AssetType, TerraformAsset, TerraformOutput } from 'cdktf';
import { Construct } from 'constructs';
import * as aws from '../../.gen/providers/aws';

/**
 * Creates and deploys infrastructure that includes an AWS Lambda function and API Gateway using Terraform.
 * It also manages the creation of necessary roles, permissions, and assets required for these components.
 */
export class FormService extends Construct {
  readonly url: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const config = {
      path: '../../apps/rest-api/dist',
      handler: 'index.lambdaHandler',
      runtime: 'nodejs18.x',
    };

    const asset = new TerraformAsset(this, 'lambda-asset', {
      path: path.resolve(__dirname, config.path),
      type: AssetType.ARCHIVE,
    });

    const role = new aws.iamRole.IamRole(this, 'lambda-role', {
      name: `${id}-lambda-function-role`,
      assumeRolePolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
            Effect: 'Allow',
            Sid: '',
          },
        ],
      }),
    });

    new aws.iamRolePolicyAttachment.IamRolePolicyAttachment(
      this,
      'lambda-managed-policy',
      {
        policyArn:
          'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
        role: role.name,
      }
    );

    const lambdaFunc = new aws.lambdaFunction.LambdaFunction(
      this,
      'lambda-function',
      {
        functionName: `${id}-lambda-function`,
        handler: config.handler,
        runtime: config.runtime,
        role: role.arn,
        filename: asset.path,
        sourceCodeHash: asset.assetHash,
      }
    );

    const api = new aws.apigatewayv2Api.Apigatewayv2Api(this, 'api-gateway', {
      name: `${id}-api-gateway`,
      protocolType: 'HTTP',
      target: lambdaFunc.arn,
    });

    new aws.lambdaPermission.LambdaPermission(this, 'apigw-lambda', {
      functionName: lambdaFunc.functionName,
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      sourceArn: `${api.executionArn}/*/*`,
    });

    this.url = api.apiEndpoint;
    new TerraformOutput(this, 'url', {
      value: api.apiEndpoint,
    });
  }
}
