import classNames from 'classnames';
import React from 'react';

import { type PatternId, type FieldsetProps } from '@atj/forms';
import { FieldsetPattern } from '@atj/forms/src/patterns/fieldset';

import { AddPatternDropdown, fieldsetPatterns } from '../AddElementMenu';
import { PatternComponent } from '../../../Form';
import Fieldset from '../../../Form/components/Fieldset';
import { useFormManagerStore } from '../../store';
import { PatternEditComponent } from '../types';

import { PatternEditActions } from './common/PatternEditActions';
import { PatternEditForm } from './common/PatternEditForm';
import { usePatternEditFormContext } from './common/hooks';
import styles from '../formEditStyles.module.css';

const FieldsetEdit: PatternEditComponent<FieldsetProps> = ({
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
        <FieldsetPreview {...previewProps} />
      )}
    </>
  );
};

const FieldsetPreview: PatternComponent<FieldsetProps> = props => {
  const { addPatternToFieldset } = useFormManagerStore(state => ({
    addPatternToFieldset: state.addPatternToFieldset,
  }));
  const pattern = useFormManagerStore(
    state => state.session.form.patterns[props._patternId]
  );
  return (
    <>
      <Fieldset {...(props as FieldsetProps)}>
        {props.children}
        {pattern && pattern.data.patterns.length === 0 && (
          <div
            data-pattern-edit-control="true"
            className={`${styles.usaAlert} usa-alert usa-alert--warning usa-alert--no-icon margin-left-3 margin-right-3 margin-bottom-3`}
          >
            <div className={`${styles.usaAlertBody} usa-alert__body`}>
              <p className="usa-alert__text">
                <span className="alert-text display-inline-block text-top margin-right-2">
                  Empty sections will not display.
                </span>
              </p>
            </div>
          </div>
        )}
        <div
          data-pattern-edit-control="true"
          className="margin-left-3 margin-right-3 margin-bottom-3 bg-none"
        >
          <hr />
          <div className={`${styles.usaAlertBody} usa-alert__body`}>
            <AddPatternDropdown
              title="Add question to fieldset"
              patternSelected={patternType =>
                addPatternToFieldset(patternType, props._patternId)
              }
              availablePatterns={fieldsetPatterns}
            />
          </div>
        </div>
      </Fieldset>
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
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
        </label>
      </div>
      <Fieldset type="fieldset" _patternId={patternId} />
      <PatternEditActions />
    </div>
  );
};

export default FieldsetEdit;
