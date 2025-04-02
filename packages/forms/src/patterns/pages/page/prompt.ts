import {
  type CreatePrompt,
  type PageProps,
  createPromptForPattern,
} from '../../../components.js';
import { getPattern, type Pattern, type PatternId } from '../../../pattern.js';
import type { Blueprint } from '../../../types.js';
import type { PageSetPattern } from '../page-set/config.js';

import { type PagePattern } from './config.js';

export const createPrompt: CreatePrompt<PagePattern> = (
  config,
  session,
  pattern,
  options
) => {
  const children = pattern.data.patterns.map((patternId: string) => {
    const childPattern = getPattern(session.form, patternId);
    return createPromptForPattern(config, session, childPattern, options);
  });
  return {
    props: {
      _patternId: pattern.id,
      type: 'page',
      title: pattern.data.title,
      // REVISIT. We should probably have a way to pass in edit-specific
      // options that are separate from createPrompt props.
      rules: pattern.data.rules,
      ruleTargetOptions: getPagePeers(session.form, pattern),
    } satisfies PageProps,
    children,
  };
};

const getPagePeers = (form: Blueprint, pattern: PagePattern) => {
  // This code currently assumes that the parent of this page the root page set,
  // and that the available target pages for a rule are the sublings of this page.
  const pageSet = form.patterns[form.root];
  if (!isPageSet(pageSet)) {
    throw new Error('Expected page set root');
  }
  if (!pageSet.data.pages.includes(pattern.id)) {
    throw new Error('Page is not a child of the root page set');
  }

  return pageSet.data.pages
    .filter(pageId => pageId !== pattern.id)
    .map(pageId => {
      const page = getPattern(form, pageId);
      return {
        value: page.id,
        label: `Go to: ${page.data.title}`,
      };
    });
};

const isPageSet = (pattern: Pattern): pattern is PageSetPattern => {
  return pattern.type === 'page-set';
};
