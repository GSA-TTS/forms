import classNames from 'classnames';
import React from 'react';
import { PatternId, AttachmentProps } from '@atj/forms';
import { AttachmentPattern, attachmentFileTypeOptions } from '@atj/forms';
import Attachment from '../../../../Form/components/Attachment/index.js';
import { useFormManagerStore } from '../../../store.js';
import { PatternEditComponent } from '../../types.js';
import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@atj/common';
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
  const maxAttachments = getFieldState('maxAttachments');
  const allowedFileTypes = getFieldState('allowedFileTypes');

  return (
    <div className="grid-row grid-gap-1">
      <div className="grid-col-12">
        <label
          className={classNames('usa-label', {
            'usa-label--error': label.error,
          })}
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
        <div className="grid-row margin-top-2 grid-gap-1">
          <div className="tablet:grid-col-4 mobile-lg:grid-col-12">
            <p
              className={classNames(
                'usa-label',
                `${styles.inlineFieldLabel}`,
                'border-bottom-1px',
                'border-base-lighter',
                {
                  'usa-label--error': allowedFileTypes.error,
                }
              )}
            >
              {message.patterns.attachment.allowedFileTypesLabel}
              {allowedFileTypes.error ? (
                <span className="usa-error-message" role="alert">
                  {allowedFileTypes.error.message}
                </span>
              ) : null}
            </p>
          </div>
          <div className="tablet:grid-col-8 mobile-lg:grid-col-12">
            <div className="grid-row margin-top-1">
              {attachmentFileTypeOptions.map(item => {
                return (
                  <div className="flex-1" key={item.value}>
                    <div className="padding-right-0">
                      <div className="usa-checkbox">
                        <input
                          className="usa-checkbox__input"
                          id={`${fieldId('allowedFileTypes')}-${item.value}`}
                          type="checkbox"
                          {...register('allowedFileTypes')}
                          value={item.value}
                          defaultChecked={pattern.data.allowedFileTypes.includes(
                            item.value
                          )}
                        ></input>
                        <label
                          className="usa-checkbox__label"
                          htmlFor={`${fieldId('allowedFileTypes')}-${item.value}`}
                        >
                          {item.label}
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-col-12">
        <div className="grid-row margin-top-2 grid-gap-1">
          <div className="tablet:grid-col-4 mobile-lg:grid-col-12">
            <label
              className={classNames(
                'usa-label',
                `${styles.inlineFieldLabel}`,
                'border-bottom-1px',
                'border-base-lighter',
                {
                  'usa-label--error': maxAttachments.error,
                }
              )}
              htmlFor={fieldId('maxAttachments')}
            >
              {message.patterns.attachment.maxAttachmentsLabel}
              {maxAttachments.error ? (
                <span className="usa-error-message" role="alert">
                  {maxAttachments.error.message}
                </span>
              ) : null}
            </label>
          </div>
          <div className="tablet:grid-col-8 mobile-lg:grid-col-12">
            <input
              className={classNames(
                `usa-input bg-primary-lighter text-bold ${styles.attachmentInputSmall}`,
                {
                  'usa-input--error': maxAttachments.error,
                }
              )}
              id={fieldId('maxAttachments')}
              type="number"
              defaultValue={pattern.data.maxAttachments}
              {...register('maxAttachments')}
              min="1"
            ></input>
          </div>
        </div>
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
