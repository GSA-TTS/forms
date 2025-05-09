import React, { PropsWithChildren, ReactElement, useMemo } from 'react';
import classNames from 'classnames';

import { useFormManagerStore } from '../../../store.js';
import MovePatternDropdown from './MovePatternDropdown.js';
import styles from '../../formEditStyles.module.css';
import type { Pattern } from '@gsa-tts/forms-core';

type PatternEditActionsProps = PropsWithChildren<{
  children?: ReactElement;
}>;

export const PatternEditActions = ({ children }: PatternEditActionsProps) => {
  children;
  const context = useFormManagerStore(state => state.context);
  const { deleteSelectedPattern } = useFormManagerStore(state => ({
    deleteSelectedPattern: state.deleteSelectedPattern,
  }));
  const focusPatternType = useFormManagerStore(
    state => state.focus?.pattern.type
  );
  const patterns = useFormManagerStore(state =>
    Object.values<Pattern>(state.session.form.patterns)
  );
  const focusPatternId = useFormManagerStore(state => state.focus?.pattern.id);
  const isPatternInCompound = useMemo(() => {
    if (!focusPatternId) return false;
    return patterns.some(
      p =>
        (p.type === 'fieldset' || p.type === 'repeater') &&
        p.data.patterns.includes(focusPatternId)
    );
  }, [focusPatternId, patterns]);
  const isCompound =
    focusPatternType === 'repeater' || focusPatternType === 'fieldset';
  const isSummary = focusPatternType === 'form-summary';
  const isPagePattern = focusPatternType === 'page';
  const { copyPattern, copyPage } = useFormManagerStore(state => ({
    copyPattern: state.copyPattern,
    copyPage: state.copyPage,
  }));
  const pages = useFormManagerStore(state =>
    Object.values<Pattern>(state.session.form.patterns).filter(
      p => p.type === 'page'
    )
  );
  const compoundFields = useFormManagerStore(state =>
    Object.values<Pattern>(state.session.form.patterns).filter(
      p => p.type === 'fieldset' || p.type === 'repeater'
    )
  );
  const handleCopyPattern = () => {
    const currentPageIndex = pages.findIndex(page =>
      page.data.patterns.includes(focusPatternId || '')
    );
    const compoundFieldIndex = compoundFields.findIndex(compoundField =>
      compoundField.data.patterns.includes(focusPatternId)
    );
    const sourcePagePatternId = pages[currentPageIndex]?.id;
    const sourceCompoundFieldPatternId = compoundFields[compoundFieldIndex]?.id;

    if (focusPatternId) {
      if (sourcePagePatternId) {
        copyPattern(sourcePagePatternId, focusPatternId);
      } else {
        copyPattern(sourceCompoundFieldPatternId, focusPatternId);
      }
    }
  };

  const handleCopyPage = () => {
    if (focusPatternId && isPagePattern) {
      copyPage(focusPatternId);
    }
  };

  return (
    <div
      className={`${styles.patternActionWrapper} margin-top-2 margin-bottom-1 padding-top-1 width-full pattern-edit-panel base-dark text-right`}
    >
      {!isSummary && (
        <div
          className={classNames(
            'border-top-1px border-bottom-1px border-base-lighter ',
            {
              'border-base-lighter': children,
              'padding-right-1': children,
              'margin-right-1': children,
            }
          )}
        >
          {!isPatternInCompound && !isPagePattern && (
            <MovePatternDropdown isCompound={isCompound} />
          )}
          <span
            className={`${styles.patternActionButtons} margin-top-1 margin-bottom-1 display-inline-block text-ttop`}
          >
            <button
              type="button"
              aria-label={
                isPagePattern
                  ? 'Create a copy of this page'
                  : 'Create a copy of this pattern'
              }
              title={
                isPagePattern
                  ? 'Create a copy of this page'
                  : 'Create a copy of this pattern'
              }
              className="usa-button--outline usa-button--unstyled"
              onClick={event => {
                event.preventDefault();
                isPagePattern ? handleCopyPage() : handleCopyPattern();
              }}
            >
              <svg
                className="usa-icon usa-icon--size-3 margin-1 text-middle"
                aria-hidden="true"
                focusable="false"
                role="img"
              >
                <use
                  xlinkHref={`${context.uswdsRoot}img/sprite.svg#content_copy`}
                ></use>
              </svg>
            </button>

            <button
              type="button"
              aria-label="Delete this pattern"
              title="Delete this pattern"
              className="usa-button--outline usa-button--unstyled"
              onClick={event => {
                event.preventDefault();
                const confirmed = window.confirm(
                  'Are you sure you want to delete this question?'
                );
                if (confirmed) {
                  deleteSelectedPattern();
                }
              }}
            >
              <svg
                className="usa-icon usa-icon--size-3 margin-1 text-middle"
                aria-hidden="true"
                focusable="false"
                role="img"
              >
                <use
                  xlinkHref={`${context.uswdsRoot}img/sprite.svg#delete`}
                ></use>
              </svg>
            </button>
            {children ? (
              <span className="padding-left-1 padding-top-2px">{children}</span>
            ) : null}
          </span>
        </div>
      )}
      <div className="padding-top-2">
        <button
          type="submit"
          aria-label="Save and Close"
          title="Save and Close"
          className="usa-button"
        >
          Save and Close
        </button>
      </div>
    </div>
  );
};
