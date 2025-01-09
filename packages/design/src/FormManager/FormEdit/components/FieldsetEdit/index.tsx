import classNames from 'classnames';
import React from 'react';

import { type PatternId, type FieldsetProps } from '@atj/forms';
import { FieldsetPattern } from '@atj/forms';

import {
  FieldsetAddPatternButton,
  FieldsetEmptyStateAddPatternButton,
} from '../../AddPatternDropdown.js';
import { useFormManagerStore } from '../../../store.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import styles from '../../formEditStyles.module.css';
import { FormManagerContext } from '../../../../index.js';
import { PatternComponent } from '../../../../Form/index.js';
import Fieldset from '../../../../Form/components/Fieldset/index.js';
import { renderEditPromptComponents } from '../../../manager-common.js';

const FieldsetEdit: PatternEditComponent<FieldsetProps> = ({
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
        <FieldsetPreview context={context} {...previewProps} />
      )}
    </>
  );
};

const FieldsetPreview: PatternComponent<FieldsetProps> = props => {
  const { addPatternToFieldset, deletePattern } = useFormManagerStore(
    state => ({
      addPatternToFieldset: state.addPatternToFieldset,
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
                  <FieldsetEmptyStateAddPatternButton
                    title="Add question"
                    patternSelected={patternType =>
                      addPatternToFieldset(patternType, props._patternId)
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
              <FieldsetAddPatternButton
                title="Add question to fieldset"
                patternSelected={patternType =>
                  addPatternToFieldset(patternType, props._patternId)
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
  const pattern = useFormManagerStore<FieldsetPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<FieldsetPattern>(patternId);
  const legend = getFieldState('legend');
  return (
    <div className="grid-row">
      <div className="grid-col-12 margin-bottom-3 flex-align-self-end">
        <input
          type="hidden"
          {...register('patterns')}
          defaultValue={pattern.data.patterns}
        ></input>
        <label
          className={classNames('usa-label width-full maxw-full', {
            'usa-label--error': legend.error,
          })}
          htmlFor={fieldId('legend')}
        >
          Legend Text Element
          {legend.error ? (
            <span className="usa-error-message" role="alert">
              {legend.error.message}
            </span>
          ) : null}
        </label>
        <input
          className={classNames('usa-input bg-primary-lighter text-bold', {
            'usa-input--error': legend.error,
          })}
          id={fieldId('legend')}
          defaultValue={pattern.data.legend}
          {...register('legend')}
          type="text"
          autoFocus
        ></input>
      </div>
      <Fieldset type="fieldset" _patternId={patternId} context={context} />
      <PatternEditActions />
    </div>
  );
};

export default FieldsetEdit;
