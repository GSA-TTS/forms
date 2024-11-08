import { type FormSession, type RouteData } from '@atj/forms';
import { type FormPageContext } from './index.js';

export type FormSessionResponse =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'loaded';
      formSession: FormSession;
      sessionId: string | undefined;
    };

export type GetFormSession = (
  ctx: FormPageContext,
  opts: {
    formId: string;
    route: {
      params: RouteData;
      url: string;
    };
    sessionId?: string;
  }
) => void;

export const getFormSession: GetFormSession = async (ctx, opts) => {
  ctx.setState({ formSessionResponse: { status: 'loading' } });
  ctx.config.formService
    .getFormSession({
      formId: opts.formId,
      formRoute: {
        params: opts.route.params,
        url: `#${opts.route.url}`,
      },
      sessionId: opts.sessionId,
    })
    .then(result => {
      if (result.success === false) {
        console.error(result.error);
        ctx.setState({
          formSessionResponse: {
            status: 'error',
            message: result.error,
          },
        });
      } else {
        console.log('using session', result.data.data);
        ctx.setState({
          formSessionResponse: {
            status: 'loaded',
            formSession: result.data.data,
            sessionId: result.data.id,
          },
        });
      }
    });
};
