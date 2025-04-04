import React from 'react';
import classNames from 'classnames';

import type {
  AccordionRowProps,
  AccordionRowPattern,
} from '@gsa-tts/forms-core';

import AccordionRow from '../../../../Form/components/AccordionRow/index.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import styles from '../../formEditStyles.module.css';

const AccordionRowPatternEdit: PatternEditComponent<AccordionRowProps> = ({
  context,
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent pattern={focus.pattern} />}
        />
      ) : (
        <div className={`padding-left-3 padding-bottom-3 padding-right-3`}>
          <AccordionRow context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: AccordionRowPattern }) => {
  const { fieldId, register, getFieldState } =
    usePatternEditFormContext<AccordionRowPattern>(pattern.id);
  const title = getFieldState('title');
  const text = getFieldState('text');

  return (
    <div className="grid-row grid-gap">
      <div className="grid-col-12 margin-bottom-2">
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': title.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
        >
          {message.patterns.accordionRow.fieldLabel}
          {title.error ? (
            <span className="usa-error-message" role="alert">
              {title.error.message}
            </span>
          ) : null}
          <input
            className={classNames(
              'usa-input bg-primary-lighter',
              {
                'usa-input--error': title.error,
              },
              `${styles.patternChoiceFieldWrapper}`
            )}
            id={fieldId('title')}
            defaultValue={pattern.data.title}
            {...register('title')}
            type="text"
            autoFocus
          />
        </label>
      </div>
      <div className="grid-col-12 margin-bottom-2">
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': text.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
        >
          {message.patterns.accordionRow.textLabel}
          {text.error ? (
            <span className="usa-error-message" role="alert">
              {text.error.message}
            </span>
          ) : null}
          <textarea
            className={classNames(
              'usa-input bg-primary-lighter',
              {
                'usa-input--error': text.error,
              },
              `${styles.patternChoiceFieldWrapper}`
            )}
            id={fieldId('text')}
            defaultValue={pattern.data.text}
            {...register('text')}
            style={{ resize: 'none', overflow: 'auto', height: '100px' }}
          />
        </label>
      </div>
      <div className="grid-col-12">
        <PatternEditActions></PatternEditActions>
      </div>
    </div>
  );
};

export default AccordionRowPatternEdit;
