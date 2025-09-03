import classnames from 'classnames';
import React from 'react';

import { PageProps } from '@gsa-tts/forms-core';
import { enLocale as message } from '@gsa-tts/forms-common';
import { PagePattern } from '@gsa-tts/forms-core';

import { useRouteParams } from '../../hooks.js';
import { PatternEditComponent } from '../types.js';

import { PatternEditActions } from './common/PatternEditActions.js';
import { PatternEditForm } from './common/PatternEditForm.js';
import { usePatternEditFormContext } from './common/hooks.js';
import { PatternPreviewSequence } from './PreviewSequencePattern/PreviewSequencePattern.js';
import styles from '../formEditStyles.module.css';

export const PageEdit: PatternEditComponent<PageProps> = props => {
  const handleParentClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // Trigger focus or any other action you want when the parent div is clicked
      event.currentTarget.focus();
    }
  };

  const { routeParams } = useRouteParams();
  const params = new URLSearchParams(routeParams?.toString());
  const pageNumberText = Number(params.get('page')) + 1;

  return (
    <>
      {props.focus ? (
        <PatternEditForm
          pattern={props.focus.pattern}
          editComponent={<PageEditComponent pattern={props.focus.pattern} />}
        ></PatternEditForm>
      ) : (
        <div
          className={`${styles.titleArea} display-flex flex-justify flex-align-center position-relative margin-bottom-205`}
          onClick={handleParentClick}
          tabIndex={0} // Make the div focusable
        >
          <span
            className={`${styles.titleText} padding-right-1 text-uppercase text-ls-1 text-base-darkest bg-primary-lighter`}
          >
            {props.previewProps.title || 'untitled page'}{' '}
            <span className="text-secondary-darker">*</span>
          </span>
          <span
            className={`${styles.pageNumber} padding-left-1 text-base-darkest bg-primary-lighter`}
          >
            Page {pageNumberText}
          </span>
        </div>
      )}
      <PatternPreviewSequence
        context={props.context}
        previewProps={{
          type: 'sequence',
          _patternId: props.previewProps._patternId,
          children: props.previewProps.children,
        }}
        childComponents={props.childComponents}
      />
    </>
  );
};

const PageEditComponent = ({ pattern }: { pattern: PagePattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<PagePattern>(pattern.id);
  const title = getFieldState('title');
  return (
    <div className="grid-row grid-gap">
      <input
        type="hidden"
        {...register('patterns')}
        defaultValue={pattern.data.patterns}
      ></input>
      <div className="tablet:grid-col-6 mobile-lg:grid-col-12">
        <label
          className={classnames('usa-label', {
            'usa-label--error': title.error,
          })}
          htmlFor={fieldId('title')}
        >
          {message.patterns.page.fieldLabel}
        </label>
        {title.error ? (
          <span className="usa-error-message" role="alert">
            {title.error.message}
          </span>
        ) : null}
        <input
          className="usa-input"
          type="text"
          id={fieldId('title')}
          defaultValue={pattern.data.title}
          {...register('title')}
          autoFocus
        ></input>
      </div>
      <div className="grid-col-12">
        <PatternEditActions />
      </div>
    </div>
  );
};
