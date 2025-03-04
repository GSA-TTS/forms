import React from 'react';
import classNames from 'classnames';

import { MyForms } from '../routes.js';
import { useFormManagerStore } from '../store.js';
import styles from './formManagerStyles.module.css';

export enum NavPage {
  edit = 1,
  settings = 2,
  publish = 3,
  preview = 4,
}

const stepClass = (page: NavPage, curPage: NavPage) => {
  if (page < curPage) {
    return 'usa-step-indicator__segment--complete';
  } else if (page === curPage) {
    return 'usa-step-indicator__segment--current';
  } else {
    return '';
  }
};

const srHint = (page: NavPage, curPage: NavPage) => {
  if (page < curPage) {
    return <span className="usa-sr-only">completed</span>;
  } else if (page === curPage) {
    return;
  } else {
    return <span className="usa-sr-only">not completed</span>;
  }
};

export const TopNavigation = ({
  curPage,
  preview,
}: {
  curPage: NavPage;
  preview?: string;
}) => {
  const uswdsRoot = useFormManagerStore(state => state.context.uswdsRoot);
  const lastSaved = useFormManagerStore(state => state.saveStatus.lastSaved);
  return (
    <div className="position-sticky top-0 z-100 bg-white border-bottom border-bottom-width-1px border-base-lighter padding-1">
      <div className="grid-container grid-row margin-bottom-105 display-block tablet:display-none">
        <div className="grid-row">
          <div className="grid-col-6">
            <MyFormsLink uswdsRoot={uswdsRoot} />
          </div>
          <div className="grid-col-6 text-base text-right font-ui-3xs padding-left-4">
            <span className="padding-right-2">Saved</span>
            {preview && <PreviewIconLink url={preview} uswdsRoot={uswdsRoot} />}
          </div>
        </div>
        <MobileStepIndicator curPage={curPage} />
      </div>
      <div className="display-none tablet:display-block margin-top-1 margin-bottom-1">
        <div className="grid-container">
          <div
            className="grid-row margin-bottom-0 classes usa-step-indicator "
            aria-label="progress"
          >
            <div className="margin-top-1 grid-col-2">
              <MyFormsLink uswdsRoot={uswdsRoot} />
            </div>
            <ol className="usa-step-indicator__segments desktop:grid-col-6 tablet:grid-col-5">
              <li
                className={classNames(
                  'usa-step-indicator__segment font-body-xs',
                  stepClass(NavPage.edit, curPage)
                )}
              >
                <span className="usa-step-indicator__segment-label">
                  Edit {srHint(NavPage.edit, curPage)}
                </span>
              </li>
              <li
                className={classNames(
                  'usa-step-indicator__segment font-body-xs',
                  stepClass(NavPage.settings, curPage)
                )}
                aria-current="true"
              >
                <span className="usa-step-indicator__segment-label">
                  Settings {srHint(NavPage.settings, curPage)}
                </span>
              </li>
              <li
                className={classNames(
                  'usa-step-indicator__segment font-body-xs',
                  stepClass(NavPage.publish, curPage)
                )}
              >
                <span className="usa-step-indicator__segment-label">
                  Publish {srHint(NavPage.publish, curPage)}
                </span>
              </li>
            </ol>
            <div className="desktop:grid-col-4 tablet:grid-col-5 text-right">
              <span
                className={`text-base font-ui-3xs padding-left-1 display-inline-block text-middle ${styles.savedStatus}`}
              >
                {lastSaved
                  ? 'Saved ' +
                    lastSaved.toLocaleDateString('en-us', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })
                  : 'Blueprint loaded'}
              </span>
              {preview && (
                <a
                  href={preview}
                  className="usa-button usa-button--outline margin-left-1 display-inline-block text-middle"
                >
                  Preview
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyFormsLink = ({ uswdsRoot }: { uswdsRoot: `${string}/` }) => (
  <a href={MyForms.getUrl()} className="usa-link margin-right-1 display-block">
    <svg
      className="usa-icon usa-icon--size-3 text-middle margin-right-1"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <use xlinkHref={`${uswdsRoot}img/sprite.svg#arrow_back`}></use>
    </svg>
    My Forms
  </a>
);

const PreviewIconLink = ({
  url,
  uswdsRoot,
}: {
  url: string;
  uswdsRoot: `${string}/`;
}) => {
  return (
    <a
      href={url}
      className="usa-link tablet:margin-right-4"
      aria-label="Preview this blueprint"
    >
      <svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
        <use xlinkHref={`${uswdsRoot}img/sprite.svg#visibility`}></use>
      </svg>
    </a>
  );
};

const MobileStepIndicator = ({ curPage }: { curPage: NavPage }) => (
  <div className="grid-row grid-gap flex-align-center">
    <div className="grid-col grid-col-4">
      <span className="usa-step-indicator__heading-counter">
        <span className="usa-sr-only">Step</span>
        <span className="usa-step-indicator__current-step">1</span>
        <span className="usa-step-indicator__total-steps margin-left-05">
          of 3
        </span>{' '}
      </span>
    </div>
    <div className="grid-col grid-col-8">
      <select
        className="usa-select"
        name="options"
        id="options"
        defaultValue={curPage}
      >
        <option value={NavPage.edit}>Edit</option>
        <option value={NavPage.settings}>Settings</option>
        <option value={NavPage.publish}>Publish</option>
      </select>
    </div>
  </div>
);
