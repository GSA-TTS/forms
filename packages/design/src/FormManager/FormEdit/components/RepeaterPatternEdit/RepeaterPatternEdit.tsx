import classNames from 'classnames';
import React from 'react';

import { type PatternId, type RepeaterProps } from '@gsa-tts/forms-core';
import { RepeaterPattern } from '@gsa-tts/forms-core';

import {
  CompoundAddPatternButton,
  CompoundAddNewPatternButton,
  AddInformationOrInstructionsButton,
} from '../../AddPatternDropdown.js';
import { PatternComponent } from '../../../../Form/types.js';
import Repeater from '../../../../Form/components/Repeater/Repeater.js';
import { useFormManagerStore } from '../../../store.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';

import styles from '../../formEditStyles.module.css';
import { renderEditPromptComponents } from '../../../manager-common.js';
import type { FormManagerContext } from '../../../types.js';

const RepeaterEdit: PatternEditComponent<RepeaterProps> = ({
  context,
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={
            <EditComponent patternId={focus.pattern.id} context={context} />
          }
        ></PatternEditForm>
      ) : (
        <RepeaterPreview context={context} {...previewProps} />
      )}
    </>
  );
};

const RepeaterPreview: PatternComponent<RepeaterProps> = props => {
  const { addPatternToCompoundField, deletePattern } = useFormManagerStore(
    state => ({
      addPatternToCompoundField: state.addPatternToCompoundField,
      deletePattern: state.deletePattern,
    })
  );
  const pattern = useFormManagerStore(
    state => state.session.form.patterns[props._patternId]
  );
  return (
    <>
      <fieldset className="usa-fieldset width-full padding-top-2">
        {props.legend !== '' && props.legend !== undefined && (
          <legend className="usa-legend text-bold text-uppercase line-height-body-4 width-full margin-top-0 padding-top-3 padding-bottom-1">
            {props.legend}
          </legend>
        )}
        {props.hint && (
          <div
            className="usa-hint padding-left-3 padding-right-3"
            id={props._patternId}
          >
            {props.hint}
          </div>
        )}
        {renderEditPromptComponents(props.context, props.childComponents)}
        {pattern && pattern.data.patterns.length === 0 && (
          <div
            data-pattern-edit-control="true"
            className={`${styles.usaAlert} usa-alert usa-alert--warning usa-alert--no-icon margin-left-3 margin-right-3 margin-bottom-3`}
          >
            <div className={`${styles.usaAlertBody} usa-alert__body`}>
              <div className="usa-alert__text">
                <span className="alert-text display-inline-block text-top margin-right-2">
                  Empty sections will not display.
                </span>
                <span className="action-text add-question display-inline-block margin-right-2">
                  <CompoundAddNewPatternButton
                    title="Add question"
                    patternSelected={patternType =>
                      addPatternToCompoundField(patternType, props._patternId)
                    }
                  />
                </span>
                <span className="action-text remove-section display-inline-block text-top margin-right-2">
                  <button
                    className="usa-button usa-button--unstyled"
                    onClick={() => {
                      deletePattern(pattern.id);
                    }}
                  >
                    Remove section
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}
        {pattern.data.patterns.length > 0 && (
          <div
            data-pattern-edit-control="true"
            className="margin-left-3 margin-right-3 margin-bottom-3 bg-none"
          >
            <div className={classNames(styles.usaAlertBody, 'usa-alert__body')}>
              <AddInformationOrInstructionsButton
                title="Add supplementary information or instructions"
                patternSelected={patternType =>
                  addPatternToCompoundField(patternType, props._patternId)
                }
              />
              <CompoundAddPatternButton
                title="Add question to set"
                patternSelected={patternType =>
                  addPatternToCompoundField(patternType, props._patternId)
                }
              />
            </div>
          </div>
        )}
      </fieldset>
    </>
  );
};

const EditComponent = ({
  context,
  patternId,
}: {
  context: FormManagerContext;
  patternId: PatternId;
}) => {
  const pattern = useFormManagerStore<RepeaterPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<RepeaterPattern>(patternId);
  const legend = getFieldState('legend');
  const hint = getFieldState('hint');
  const addButtonLabel = getFieldState('addButtonLabel');

  return (
    <div className="grid-row">
      <div className="grid-col-12 margin-bottom-3 flex-align-self-end">
        <input
          type="hidden"
          {...register('patterns')}
          defaultValue={pattern.data.patterns}
        ></input>
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': legend.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
          htmlFor={fieldId('legend')}
        >
          Question set label
          {legend.error ? (
            <span className="usa-error-message" role="alert">
              {legend.error.message}
            </span>
          ) : null}
        </label>
        <input
          className={classNames(
            'usa-input bg-primary-lighter',
            {
              'usa-input--error': legend.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
          id={fieldId('legend')}
          defaultValue={pattern.data.legend}
          {...register('legend')}
          type="text"
          autoFocus
        ></input>
      </div>
      <div className="grid-col-12 margin-bottom-3 flex-align-self-end">
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': addButtonLabel.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
          htmlFor={fieldId('addButtonLabel')}
        >
          Button to add to the set
          {addButtonLabel.error ? (
            <span className="usa-error-message" role="alert">
              {addButtonLabel.error.message}
            </span>
          ) : null}
        </label>
        <input
          className={classNames(
            'usa-input bg-primary-lighter',
            {
              'usa-input--error': addButtonLabel.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
          id={fieldId('addButtonLabel')}
          defaultValue={pattern.data.addButtonLabel}
          {...register('addButtonLabel')}
          type="text"
        ></input>
      </div>
      <div className="grid-col-12 margin-bottom-2">
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': hint.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
          htmlFor={fieldId('hint')}
        >
          <span className={`${styles.secondaryColor}`}>
            {message.patterns.repeater.hintLabel}
          </span>
          {hint.error ? (
            <span className="usa-error-message" role="alert">
              {hint.error.message}
            </span>
          ) : null}
          <textarea
            className={classNames(
              'usa-input bg-primary-lighter',
              {
                'usa-input--error': hint.error,
              },
              `${styles.patternChoiceFieldWrapper}`
            )}
            id={fieldId('hint')}
            defaultValue={pattern.data.hint}
            {...register('hint')}
            style={{ resize: 'none', overflow: 'auto', height: '100px' }}
          />
        </label>
      </div>
      <Repeater type="repeater" _patternId={patternId} context={context} />
      <PatternEditActions />
    </div>
  );
};

export default RepeaterEdit;
