import { type APIContext, type AstroGlobal } from 'astro';

import {
  type AuthRepository,
  type LoginGovOptions,
  createAuthRepository,
} from '@gsa-tts/forms-auth';
import { defaultFormConfig } from '@gsa-tts/forms-core';

import { type AppContext } from './context.js';
import { type ServerOptions, createDevServerOptions } from './options.js';
import { createServerFormService } from './services.js';

export const getServerContext = async (Astro: any): Promise<AppContext> => {
  if (!Astro.locals.ctx) {
    Astro.locals.ctx = await createAstroAppContext(
      Astro,
      import.meta.env,
      Astro.locals.serverOptions || (await createDevServerOptions())
    );
  }
  return Astro.locals.ctx;
};

const createAstroAppContext = async (
  Astro: AstroGlobal | APIContext,
  env: any,
  serverOptions: ServerOptions
): Promise<AppContext> => {
  return {
    agencyBranding: serverOptions.agencyBranding,
    auth: await createDefaultAuthContext({
      Astro,
      authRepository: createAuthRepository(serverOptions.db),
      loginGovOptions: serverOptions.loginGovOptions,
      isUserAuthorized: serverOptions.isUserAuthorized,
    }),
    baseUrl: env.BASE_URL,
    formConfig: defaultFormConfig,
    formService: createServerFormService(serverOptions, {
      isUserLoggedIn: () => !!getUserSession(Astro).user,
    }),
    github: env.GITHUB,
    title: serverOptions.title,
    uswdsRoot: `${env.BASE_URL}uswds/`,
  };
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
  const { LoginGov, BaseAuthContext } = await import('@gsa-tts/forms-auth');
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

export const getAstroRouteParams = <const T extends readonly string[]>(
  Astro: AstroGlobal | APIContext,
  params: T
) => {
  return params.reduce(
    (acc: Record<T[number], string>, param: T[number]) => {
      const value = Astro.params[param];
      if (value === undefined) {
        throw new Error(`Missing required parameter: ${param}`);
      }
      acc[param] = value;
      return acc;
    },
    {} as Record<T[number], string>
  );
};

export const getSearchString = (Astro: AstroGlobal | APIContext) => {
  return Astro.url.search.startsWith('?')
    ? Astro.url.search.substring(1)
    : Astro.url.search;
};
