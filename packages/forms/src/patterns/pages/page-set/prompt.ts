import { z } from 'zod';

import { type RouteData } from '../../../route-data.js';
import { safeZodParseFormErrors } from '../../../util/zod.js';

import { type PagePattern } from '../page/config.js';
import { type ActionName, getActionString } from '../../../submission.js';
import {
  type CreatePrompt,
  type PageSetProps,
  type PromptAction,
  createPromptForPattern,
} from '../../../components.js';
import { getPattern } from '../../../pattern.js';
import { type FormSession } from '../../../session.js';

import { type PageSetPattern } from './config.js';

export const createPrompt: CreatePrompt<PageSetPattern> = (
  config,
  session,
  pattern,
  options
) => {
  const route = parseRouteData(pattern, session.route?.params);
  const activePage = route.success ? route.data.page : null;
  const children =
    activePage !== null
      ? [
          createPromptForPattern(
            config,
            session,
            getPattern(session.form, pattern.data.pages[activePage]),
            options
          ),
        ]
      : [];
  const actions = getActionsForPage({
    session,
    pageCount: pattern.data.pages.length,
    pageIndex: activePage,
    pattern,
  });
  return {
    props: {
      _patternId: pattern.id,
      type: 'page-set',
      actions,
      pages: pattern.data.pages.map((patternId, index) => {
        const childPattern = getPattern(session.form, patternId) as PagePattern;
        if (childPattern.type !== 'page') {
          throw new Error('Page set children must be pages');
        }
        const params = new URLSearchParams({
          ...session.route?.params,
          page: index.toString(),
        });
        return {
          title: childPattern.data.title || 'Untitled',
          selected: index === activePage,
          url: session.route?.url + '?' + params.toString(),
          visited: index < (activePage || 0),
        };
      }),
    } satisfies PageSetProps,
    children,
  };
};

const getRouteParamSchema = (pattern: PageSetPattern) => {
  return z.object({
    page: z.coerce
      .number()
      .min(0)
      .max(pattern.data.pages.length - 1)
      .default(0),
  });
};

const parseRouteData = (pattern: PageSetPattern, routeParams?: RouteData) => {
  const schema = getRouteParamSchema(pattern);
  return safeZodParseFormErrors(schema, routeParams || {});
};

const getActionsForPage = (opts: {
  session: FormSession;
  pageCount: number;
  pageIndex: number | null;
  pattern: PageSetPattern;
}): PromptAction[] => {
  if (opts.pageIndex === null) {
    return [];
  }
  const actions: PromptAction[] = [];
  if (opts.pageIndex > 0) {
    const pathName = opts.session.route?.url || '';
    actions.push({
      type: 'link',
      text: 'Back',
      url: `${pathName}?page=${opts.pageIndex - 1}`,
    });
  }
  const actionName: ActionName = getActionString({
    handlerId: 'page-set',
    patternId: opts.pattern.id,
  });
  if (opts.pageIndex < opts.pageCount - 1) {
    actions.push({
      type: 'submit',
      submitAction: actionName,
      text: 'Next',
    });
  } else {
    actions.push({
      type: 'submit',
      submitAction: actionName,
      text: 'Submit',
    });
  }
  return actions;
};
