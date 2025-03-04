import { failure, success } from '@gsa-tts/forms-common';

import {
  getPatternConfig,
  getPatternSafely,
  aggregatePatternSessionValues,
} from '../../pattern.js';
import { type FormSession } from '../../session';
import { type SubmitHandler } from '../../submission';
import { type PagePattern } from '../page/config';
import { type PageSetPattern } from './config';

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

  // Increment the page number if there are no errors and this isn't the last page.
  const lastPage = opts.pattern.data.pages.length - 1;
  const nextPage =
    Object.values(result.errors).length === 0 && pageNumber < lastPage
      ? pageNumber + 1
      : pageNumber;

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
