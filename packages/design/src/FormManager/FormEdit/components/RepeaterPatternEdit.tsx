import classNames from 'classnames';
import React from 'react';

import { type PatternId, type RepeaterProps } from '@atj/forms';
import { RepeaterPattern } from '@atj/forms';

import {
  RepeaterAddPatternButton,
  RepeaterEmptyStateAddPatternButton,
} from '../AddPatternDropdown.js';
import { PatternComponent } from '../../../Form/index.js';
import Repeater from '../../../Form/components/Repeater/index.js';
import { useFormManagerStore } from '../../store.js';
import { PatternEditComponent } from '../types.js';

import { PatternEditActions } from './common/PatternEditActions.js';
import { PatternEditForm } from './common/PatternEditForm.js';
import { usePatternEditFormContext } from './common/hooks.js';
import styles from '../formEditStyles.module.css';

const RepeaterEdit: PatternEditComponent<RepeaterProps> = ({
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent patternId={focus.pattern.id} />}
        ></PatternEditForm>
      ) : (
        <RepeaterPreview {...previewProps} />
      )}
    </>
  );
};

const RepeaterPreview: PatternComponent<RepeaterProps> = props => {
  const { addPatternToRepeater, deletePattern } = useFormManagerStore(
    state => ({
      addPatternToRepeater: state.addPatternToRepeater,
      deletePattern: state.deletePattern,
    })
  );
  const propsOverride = {
    ...props,
    showControls: false
  };
  const pattern = useFormManagerStore(
    state => state.session.form.patterns[props._patternId]
  );
  return (
    <>
      <Repeater {...(propsOverride as RepeaterProps)}>
        {props.children}
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
                  <RepeaterEmptyStateAddPatternButton
                    title="Add question"
                    patternSelected={patternType =>
                      addPatternToRepeater(patternType, props._patternId)
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
              <RepeaterAddPatternButton
                title="Add question to repeater"
                patternSelected={patternType =>
                  addPatternToRepeater(patternType, props._patternId)
                }
              />
            </div>
          </div>
        )}
      </Repeater>
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore<RepeaterPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<RepeaterPattern>(patternId);
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
      <Repeater type="repeater" _patternId={patternId} />
      <PatternEditActions />
    </div>
  );
};

export default RepeaterEdit;
