import { failure, success } from '@gsa-tts/forms-common';

import {
  getPatternConfig,
  getPatternSafely,
  aggregatePatternSessionValues,
  type PatternId,
  type PatternValue,
} from '../../pattern.js';
import { type FormSession } from '../../session';
import { type SubmitHandler } from '../../submission';
import { type PagePattern } from './page/config';
import type { PageSetPattern } from './page-set/config.js';
import type { FormError } from '../../error.js';

const getPage = (formSession: FormSession) => {
  const page = formSession.route?.params.page?.toString();
  return typeof page == 'string' ? Number.parseInt(page) : 0;
};

export const submitPage: SubmitHandler<PageSetPattern> = async (
  context,
  opts
) => {
  const pageNumber = getPage(opts.session);
  const pagePatternId = opts.pattern.data.pages[pageNumber];
  if (pagePatternId === undefined) {
    return failure(`Page ${pageNumber} does not exist`);
  }

  const pagePatternConfig = getPatternConfig(context.config, 'page');
  const pagePattern = getPatternSafely<PagePattern>({
    type: 'page',
    form: opts.session.form,
    patternId: pagePatternId,
  });
  if (!pagePattern.success) {
    return failure(pagePattern.error);
  }

  const result = aggregatePatternSessionValues(
    context.config,
    opts.session.form,
    pagePatternConfig,
    pagePattern.data,
    opts.data,
    {
      values: { ...opts.session.data.values },
      errors: { ...opts.session.data.errors },
    }
  );

  const nextPage = getNextPage({
    pageSet: opts.pattern,
    page: pagePattern.data,
    pageNumber,
    data: result,
  });

  return success({
    session: {
      ...opts.session,
      data: result,
      route: opts.session.route
        ? {
            ...opts.session.route,
            params: {
              ...opts.session.route.params,
              page: nextPage.toString(),
            },
          }
        : undefined,
    },
  });
};

const getNextPage = (opts: {
  pageSet: PageSetPattern;
  page: PagePattern;
  pageNumber: number;
  data: {
    values: Record<PatternId, PatternValue>;
    errors: Record<PatternId, FormError>;
  };
}) => {
  // Evaluate page rules
  const ruleMatch = opts.page.data.rules
    ? opts.page.data.rules.find(rule => {
        if (rule.condition.operator === '=') {
          const value = opts.data.values[rule.patternId];
          if (value === rule.condition.value) {
            return true;
          }
        } else {
          throw new Error(
            `Unsupported rule operator: "${rule.condition.operator}"`
          );
        }
      })
    : undefined;

  // Get the page number for the 1st rule match, or the next page if no rules
  // match.
  const lastPage = opts.pageSet.data.pages.length - 1;
  const nextPage =
    Object.values(opts.data.errors).length === 0 && opts.pageNumber < lastPage
      ? ruleMatch
        ? opts.pageSet.data.pages.indexOf(ruleMatch.next)
        : opts.pageNumber + 1
      : opts.pageNumber;

  return nextPage;
};
