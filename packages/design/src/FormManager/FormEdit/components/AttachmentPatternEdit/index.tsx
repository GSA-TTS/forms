import classNames from 'classnames';
import React from 'react';
import { PatternId, AttachmentProps } from '@gsa-tts/forms-core';
import { AttachmentPattern } from '@gsa-tts/forms-core';
import Attachment from '../../../../Form/components/Attachment/index.js';
import { useFormManagerStore } from '../../../store.js';
import { PatternEditComponent } from '../../types.js';
import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@gsa-tts/forms-common';
import styles from './attachmentPatternEditStyles.module.css';

const AttachmentPatternEdit: PatternEditComponent<AttachmentProps> = ({
  context,
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
        <div className="padding-left-3 padding-bottom-3 padding-right-3">
          <Attachment context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore<AttachmentPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, register, getFieldState } =
    usePatternEditFormContext<AttachmentPattern>(patternId);

  const label = getFieldState('label');

  return (
    <div className="grid-row grid-gap-1">
      <div className="grid-col-12">
        <label
          className={classNames(
            'usa-label',
            {
              'usa-label--error': label.error,
            },
            `${styles.patternChoiceFieldWrapper}`
          )}
          htmlFor={fieldId('label')}
        >
          {message.patterns.attachment.fieldLabel}
          {label.error ? (
            <span className="usa-error-message" role="alert">
              {label.error.message}
            </span>
          ) : null}
          <input
            className={classNames('usa-input bg-primary-lighter text-bold', {
              'usa-input--error': label.error,
            })}
            id={fieldId('label')}
            defaultValue={pattern.data.label}
            {...register('label')}
            type="text"
            autoFocus
          ></input>
        </label>
      </div>
      <div className="grid-col-12">
        <PatternEditActions>
          <span className="usa-checkbox">
            <input
              style={{ display: 'inline-block' }}
              className="usa-checkbox__input bg-primary-lighter"
              type="checkbox"
              id={fieldId('required')}
              {...register('required')}
              defaultChecked={pattern.data.required}
            />
            <label
              style={{ display: 'inline-block' }}
              className="usa-checkbox__label"
              htmlFor={fieldId('required')}
            >
              Required
            </label>
          </span>
        </PatternEditActions>
      </div>
    </div>
  );
};

export default AttachmentPatternEdit;
