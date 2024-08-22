import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { type APIContext, type AstroGlobal } from 'astro';

import type { AuthServiceContext, LoginGovOptions } from '@atj/auth';
import {
  type FormConfig,
  type FormRepository,
  type FormService,
  createFormService,
  defaultFormConfig,
} from '@atj/forms';

import { type GithubRepository } from './lib/github.js';
import {
  AuthRepository,
  createAuthRepository,
} from '@atj/auth/dist/repository/index.js';
import { createFormsRepository } from '@atj/forms/src/repository/index.js';

export type AppContext = {
  auth: AuthServiceContext;
  baseUrl: `${string}/`;
  formConfig: FormConfig;
  formService: FormService;
  github: GithubRepository;
  title: string;
  uswdsRoot: `${string}/`;
};

export type ServerOptions = {
  title: string;
  db: {
    auth: AuthRepository;
    forms: FormRepository;
  };
  loginGovOptions: LoginGovOptions;
  isUserAuthorized: (email: string) => Promise<boolean>;
};

export const getAstroAppContext = async (Astro: any): Promise<AppContext> => {
  if (!Astro.locals.ctx) {
    Astro.locals.ctx = await createAstroAppContext(Astro, import.meta.env);
  }
  return Astro.locals.ctx;
};

const createAstroAppContext = async (
  Astro: AstroGlobal | APIContext,
  env: any
): Promise<AppContext> => {
  const serverOptions = await getServerOptions(Astro);
  return {
    auth: await createDefaultAuthContext({
      Astro,
      authRepository: serverOptions.db.auth,
      loginGovOptions: serverOptions.loginGovOptions,
      isUserAuthorized: serverOptions.isUserAuthorized,
    }),
    baseUrl: env.BASE_URL,
    formConfig: defaultFormConfig,
    formService: createFormService({
      repository: serverOptions.db.forms,
      config: defaultFormConfig,
    }),
    github: env.GITHUB,
    title: serverOptions.title,
    uswdsRoot: `${env.BASE_URL}uswds/`,
  };
};

const getDefaultServerOptions = async (): Promise<ServerOptions> => {
  const db = await createDefaultDatabaseGateway();
  return {
    title: 'Form Service',
    db,
    loginGovOptions: {
      loginGovUrl: 'https://idp.int.identitysandbox.gov',
      clientId:
        'urn:gov:gsa:openidconnect.profiles:sp:sso:gsa:tts-10x-atj-dev-server-doj',
      //clientSecret: import.meta.env.SECRET_LOGIN_GOV_PRIVATE_KEY,
      redirectURI: 'http://localhost:4322/signin/callback',
    },
    isUserAuthorized: async (email: string) => {
      return true;
    },
  };
};

const getServerOptions = async (Astro: AstroGlobal | APIContext) => {
  return Astro.locals.serverOptions || (await getDefaultServerOptions());
};

const getDirname = () => dirname(fileURLToPath(import.meta.url));

const createDefaultDatabaseGateway = async () => {
  const { createFilesystemDatabaseContext } = await import('@atj/database');
  const ctx = await createFilesystemDatabaseContext(
    join(getDirname(), '../main.db')
  );
  const gateway = {
    auth: createAuthRepository(ctx),
    forms: createFormsRepository(ctx),
  };
  return Promise.resolve(gateway);
};

const getOriginFromRequest = (Astro: AstroGlobal | APIContext) => {
  const url = new URL(Astro.request.url);
  const scheme = url.protocol;
  const hostname = url.hostname;
  const port = url.port;
  return `${scheme}//${hostname}${port ? `:${port}` : ''}`;
};

const createDefaultAuthContext = async ({
  Astro,
  authRepository,
  loginGovOptions,
  isUserAuthorized,
}: {
  Astro: AstroGlobal | APIContext;
  authRepository: AuthRepository;
  loginGovOptions: LoginGovOptions;
  isUserAuthorized: (email: string) => Promise<boolean>;
}) => {
  const { LoginGov, BaseAuthContext } = await import('@atj/auth');
  return new BaseAuthContext(
    authRepository,
    new LoginGov({
      ...loginGovOptions,
      redirectURI: `${getOriginFromRequest(Astro)}/signin/callback`,
    }),
    function getCookie(name: string) {
      return Astro.cookies.get(name)?.value;
    },
    function setCookie(cookie) {
      Astro.cookies.set(cookie.name, cookie.value, cookie.attributes);
    },
    function setUserSession({ session, user }) {
      Astro.locals.session = session;
      Astro.locals.user = user;
    },
    isUserAuthorized
  );
};

export const getUserSession = (Astro: any) => {
  return {
    session: Astro.locals.session,
    user: Astro.locals.user,
  };
};
