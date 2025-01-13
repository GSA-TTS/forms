import { App } from 'cdktf';

const app = new App();

const deployEnv = process.env.DEPLOY_ENV;

switch (deployEnv) {
  case 'main':
    import('./spaces/main');
    break;
  case 'demo':
    import('./spaces/demo');
    break;
  default:
    throw new Error(`Please specify a valid environment (got: "${deployEnv}")`);
}

app.synth();
