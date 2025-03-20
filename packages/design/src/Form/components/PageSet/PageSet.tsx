import React from 'react';

import { type PageSetProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../index.js';
import ActionBar from '../../../Form/ActionBar/index.js';

import { PageMenu } from './PageMenu/index.js';
import { renderPromptComponents } from '../../form-common.js';
import classNames from 'classnames';

const PageSet: PatternComponent<PageSetProps> = props => {
  const currentPageIndex = props.pages.findIndex(page => page.selected);

  return (
    <div className="grid-row">
      <nav className="tablet:grid-col-3 padding-x-2 tablet:padding-y-3 tablet:padding-right-4 tablet:padding-left-0">
        <PageMenu pages={props.pages} />
      </nav>
      <div
        className="tablet:grid-col-9 tablet:padding-left-4 padding-left-0 padding-bottom-3 padding-top-3 tablet:border-left tablet:border-base-lighter contentWrapper"
        aria-live="polite"
      >
        <div className="usa-step-indicator usa-step-indicator--no-labels">
          <ol className="usa-step-indicator__segments">
            {props.pages.map((page, index) => (
              <li
                className={classNames('usa-step-indicator__segment', {
                  'usa-step-indicator__segment--complete': !page.selected,
                  'usa-step-indicator__segment--current': page.selected,
                })}
                key={index}
              >
                <span className="usa-step-indicator__segment-label">
                  {page.title}
                </span>
              </li>
            ))}
          </ol>
          <div className="usa-step-indicator__header">
            <h4 className="usa-step-indicator__heading">
              <span className="usa-step-indicator__heading-counter">
                <span className="usa-sr-only">Step</span>
                <span className="usa-step-indicator__current-step">
                  {currentPageIndex + 1}
                </span>
                <span className="usa-step-indicator__total-steps">
                  {` of ${props.pages.length}`}
                </span>
              </span>
              <span className="usa-step-indicator__heading-text">
                {props.pages[currentPageIndex].title}
              </span>
            </h4>
          </div>
        </div>
        {renderPromptComponents(props.context, props.childComponents)}
        <ActionBar actions={props.actions} />
      </div>
    </div>
  );
};

export default PageSet;
