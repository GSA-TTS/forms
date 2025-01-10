import { OAuth2ProviderWithPKCE } from 'arctic';
import { TimeSpan, createDate } from 'oslo';
import { parseJWT } from 'oslo/jwt';
import { OAuth2Client } from 'oslo/oauth2';

export type LoginGovUrl =
  | 'https://idp.int.identitysandbox.gov'
  | 'https://secure.login.gov';

const getTokenEndpoint = (url: LoginGovUrl) =>
  `${url}/api/openid_connect/token`;
const getAuthorizeEndpoint = (url: LoginGovUrl) =>
  `${url}/openid_connect/authorize?acr_values=http://idmanagement.gov/ns/assurance/ial/1`;

export type LoginGovOptions = {
  loginGovUrl: LoginGovUrl;
  clientId: string;
  //clientSecret: string;
  redirectURI?: string;
};

/**
 * The LoginGov class implements the OAuth2ProviderWithPKCE interface
 * and provides functionality to authenticate users using Login.gov's
 * OAuth 2.0 with PKCE flow.
 */
export class LoginGov implements OAuth2ProviderWithPKCE {
  private client: OAuth2Client;
  //private clientSecret: string;

  constructor(opts: LoginGovOptions) {
    this.client = new OAuth2Client(
      opts.clientId,
      getAuthorizeEndpoint(opts.loginGovUrl),
      getTokenEndpoint(opts.loginGovUrl),
      {
        redirectURI: opts.redirectURI,
      }
    );
    //this.clientSecret = opts.clientSecret;
  }

  public async createAuthorizationURL(
    state: string,
    codeVerifier: string,
    options?: {
      scopes?: string[];
      nonce?: string;
    }
  ): Promise<URL> {
    const scopes = options?.scopes ?? [];
    const url = await this.client.createAuthorizationURL({
      state,
      codeVerifier,
      codeChallengeMethod: 'S256',
      // User attributes (scopes): https://developers.login.gov/attributes/
      scopes: [...scopes, 'openid', 'email'],
    });
    if (options?.nonce) {
      url.searchParams.set('nonce', options?.nonce);
    }
    return url;
  }

  public async validateAuthorizationCode(
    code: string,
    codeVerifier: string
  ): Promise<LoginGovTokens> {
    const result =
      await this.client.validateAuthorizationCode<AuthorizationCodeResponseBody>(
        code,
        {
          authenticateWith: 'request_body',
          //credentials: this.clientSecret,
          codeVerifier,
        }
      );

    const tokens: LoginGovTokens = {
      accessToken: result.access_token,
      refreshToken: result.refresh_token ?? null,
      accessTokenExpiresAt: createDate(new TimeSpan(result.expires_in, 's')),
      idToken: result.id_token,
      decodedToken: parseJWT(result.id_token)!.payload,
    };

    return tokens;
  }
}

interface AuthorizationCodeResponseBody {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token: string;
}

export interface LoginGovTokens {
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: Date;
  idToken: string;
  decodedToken: any;
}
