import classnames from 'classnames';
import React, { useState } from 'react';

import { PagePattern, PageProps } from '@gsa-tts/forms-core';
import { enLocale as message } from '@gsa-tts/forms-common';

import { useRouteParams } from '../../../hooks.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { PatternPreviewSequence } from '../PreviewSequencePattern/index.js';
import styles from '../../formEditStyles.module.css';
import type { FormManagerContext } from '../../../index.js';

export const PageEdit: PatternEditComponent<PageProps> = props => {
  const [editingRule, setEditingRule] = useState<
    PageProps['rules'][number] | null
  >(null);

  return (
    <>
      {props.focus ? (
        <PatternEditForm
          pattern={props.focus.pattern}
          editComponent={<PageEditComponent pattern={props.focus.pattern} />}
        ></PatternEditForm>
      ) : (
        <PageEditHeader title={props.previewProps.title} />
      )}

      <RuleEdit
        context={props.context}
        ruleTargetOptions={props.previewProps.ruleTargetOptions}
        previewProps={props.previewProps}
        editingRule={editingRule}
      />
      {/* I can't get the pattern here. hmmmm */}
      {props.focus?.pattern && (
        <PatternEditForm
          pattern={props.focus.pattern}
          editComponent={
            <RuleEdit
              context={props.context}
              ruleTargetOptions={props.previewProps.ruleTargetOptions}
              previewProps={props.previewProps}
              editingRule={editingRule}
            />
          }
        ></PatternEditForm>
      )}

      {!editingRule && (
        <>
          <PatternPreviewSequence
            context={props.context}
            previewProps={{
              type: 'sequence',
              _patternId: props.previewProps._patternId,
              children: props.previewProps.children,
            }}
          />
          <RuleEditList
            context={props.context}
            previewProps={props.previewProps}
            setEditRule={setEditingRule}
          />
        </>
      )}
    </>
  );
};

const RuleEdit = (props: {
  context: FormManagerContext;
  ruleTargetOptions: { value: string; label: string }[];
  previewProps: React.PropsWithChildren<PageProps>;
  editingRule: PageProps['rules'][number] | null;
}) => {
  const { register } = usePatternEditFormContext<PagePattern>(
    props.previewProps._patternId
  );

  return props.previewProps.rules.map(
    (rule, index) =>
      rule === props.editingRule && (
        <div key={index}>
          <CustomRuleInfoAlert />
          <div
            className="border-base padding-2 margin-top-2"
            data-pattern-edit-control="false"
          >
            {props.previewProps.children}
          </div>
          <div className="display-flex flex-align-center flex-justify-between">
            <div className="flex-fill">
              <svg
                className="usa-icon usa-icon--size-3 margin-right-1"
                aria-hidden="true"
                focusable="false"
                role="img"
              >
                <use
                  xlinkHref={`${props.context.uswdsRoot}img/sprite.svg#directions`}
                ></use>
              </svg>
              If the applicant makes the selection above, then:
            </div>
            <select className="usa-select" {...register(`rules.${index}.next`)}>
              {props.ruleTargetOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <label htmlFor={`rules.${index}.alertMessage`}>
            (Optional) Alert message
          </label>
          <textarea
            className="usa-textarea padding-top-1"
            {...register(`rules.${index}.alertMessage`)}
          ></textarea>
          <div className="display-flex flex-row flex-justify-end">
            <button className="usa-button usa-button--outline margin-top-1">
              Cancel
            </button>
            <button className="usa-button usa-button--primary margin-top-1">
              Save
            </button>
          </div>
        </div>
      )
  );
};

const RuleEditList = (props: {
  context: FormManagerContext;
  setEditRule: (rule: PageProps['rules'][number] | null) => void;
  previewProps: PageProps;
}) => {
  return (
    <div data-pattern-edit-control="true">
      <div className="margin-y-2">
        <strong>NAVIGATION:</strong> After the current page is completed, go to
        the next page unless a custom rule applies.
      </div>
      {props.previewProps.rules.map((rule, index) => (
        <EditRuleRow
          key={index}
          context={props.context}
          setEditRule={props.setEditRule}
          rule={rule}
        />
      ))}
      <hr className="border-base-lighter margin-top-2" />
      <div className="margin-top-2">
        <button
          type="button"
          className="usa-button usa-button--unstyled display-flex flex-align-center"
        >
          <svg
            className="usa-icon usa-icon--size-3 margin-right-1"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use
              xlinkHref={`${props.context.uswdsRoot}img/sprite.svg#add_circle`}
            ></use>
          </svg>
          Create custom rule
        </button>
      </div>
    </div>
  );
};

const EditRuleRow = (props: {
  context: FormManagerContext;
  setEditRule: (rule: PageProps['rules'][number] | null) => void;
  rule: PageProps['rules'][number];
}) => {
  return (
    <div>
      <div className="display-flex flex-justify flex-align-center margin-y-1">
        <div className="display-flex flex-align-center">
          <svg
            className="usa-icon usa-icon--size-3 margin-right-1"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use
              xlinkHref={`${props.context.uswdsRoot}img/sprite.svg#directions`}
            ></use>
          </svg>
          <div>
            If{' '}
            <button
              className="usa-button usa-button--unstyled"
              onClick={() => props.setEditRule(props.rule)}
            >
              these questions
            </button>{' '}
            are selected, go to{' '}
            <span className="text-bold">{props.rule.next}</span>.
          </div>
        </div>
        <div className="display-flex flex-align-center">
          <RuleButton context={props.context} icon="edit" label="Edit rule" />
          <RuleButton
            context={props.context}
            icon="content_copy"
            label="Copy rule"
          />
          <RuleButton
            context={props.context}
            icon="delete"
            label="Delete rule"
          />
          <RuleButton
            context={props.context}
            icon="drag_handle"
            label="Reorder rule"
          />
        </div>
      </div>
    </div>
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

const RuleButton = (props: {
  context: FormManagerContext;
  icon: string;
  label: string;
}) => (
  <button className="usa-button usa-button--unstyled">
    <svg
      className="usa-icon usa-icon--size-3 margin-right-1"
      aria-label={props.label}
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <use
        xlinkHref={`${props.context.uswdsRoot}img/sprite.svg#${props.icon}`}
      ></use>
    </svg>
  </button>
);

const PageEditHeader = (props: { title: string }) => {
  const { routeParams } = useRouteParams();
  const params = new URLSearchParams(routeParams?.toString());
  const pageNumberText = Number(params.get('page')) + 1;

  const handleParentClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // Trigger focus or any other action you want when the parent div is clicked
      event.currentTarget.focus();
    }
  };

  return (
    <div
      className={`${styles.titleArea} display-flex flex-justify flex-align-center position-relative margin-bottom-205`}
      onClick={handleParentClick}
      tabIndex={0} // Make the div focusable
    >
      <span
        className={`${styles.titleText} padding-right-1 text-uppercase text-ls-1 text-base-darkest bg-primary-lighter`}
      >
        {props.title || 'untitled page'}{' '}
        <span className="text-secondary-darker">*</span>
      </span>
      <span
        className={`${styles.pageNumber} padding-left-1 text-base-darkest bg-primary-lighter`}
      >
        Page {pageNumberText}
      </span>
    </div>
  );
};

const CustomRuleInfoAlert = () => (
  <div className="usa-alert usa-alert--info">
    <div className="usa-alert__body">
      <h4 className="usa-alert__heading">To create a custom rule:</h4>
      <p className="usa-alert__text">
        <ol>
          <li>Answer this question as if you were the applicant.</li>
          <li>Decide on what action to take based on your answer.</li>
        </ol>
      </p>
    </div>
  </div>
);
