import { Construct } from 'constructs';

import * as cloudfoundry from '../../../.gen/providers/cloudfoundry';
import { CLOUD_GOV_ORG_NAME } from './config';
import { AstroService } from './node-astro';
import { getSecret } from '../secrets';

/**
 * Initializes a [Cloud.gov space](https://cloud.gov/docs/getting-started/concepts/#spaces) within a specified organization
 * and deploys AstroService instance(s)
 */
export class CloudGovSpace extends Construct {
  constructor(scope: Construct, id: string, gitCommitHash: string) {
    super(scope, id);

    const space = new cloudfoundry.dataCloudfoundrySpace.DataCloudfoundrySpace(
      scope,
      `${id}-data-space`,
      {
        name: id,
        orgName: CLOUD_GOV_ORG_NAME,
      }
    );

    new AstroService(
      scope,
      `${id}-server-doj`,
      space.id,
      `server-doj:${gitCommitHash}`,
      {
        loginGovPrivateKey: getSecret(
          this,
          `/${id}/server-doj/login.gov/private-key`
        ),
      }
    );
  }
}
