import classNames from 'classnames';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { type AttachmentProps } from '@gsa-tts/forms-core';
import { attachmentFileTypeOptions } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../../Form/index.js';

const Attachment: PatternComponent<AttachmentProps> = props => {
  const { register } = useFormContext();
  const { onChange, onBlur, name, ref } = register(
    props.inputId || Math.random().toString()
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]) => {
    if (files.length > props.maxAttachments) {
      return `There is a maximum of ${props.maxAttachments} files.`;
    }

    const allowedFileTypes = Array.isArray(props.allowedFileTypes)
      ? props.allowedFileTypes
      : [props.allowedFileTypes];
    const invalidFile = files.find(
      file => !allowedFileTypes.includes(file.type)
    );
    if (invalidFile) {
      return `Sorry. Only ${new Intl.ListFormat('en', {
        style: 'short',
        type: 'disjunction',
      }).format(
        getFileTypeLabelFromMimes(props.allowedFileTypes)
      )} files are accepted.`;
    }

    const maxFileSizeBytes = props.maxFileSizeMB * 1024 * 1024;
    const oversizedFile = files.find(file => file.size > maxFileSizeBytes);
    if (oversizedFile) {
      return `The maximum allowable size per file is ${props.maxFileSizeMB} MB.`;
    }

    return null;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const errorMsg = validateFiles(files);
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setError(null);
    setAttachments(files);
    return onChange(event);
  };

  return (
    <div className="usa-form-group-wrapper" key={props.inputId}>
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': props.error || error,
        })}
      >
        <div className="usa-form-group">
          <p className="text-bold" id={`label-${props.inputId}`}>
            {props.label}
            {props.required && <span className="required-indicator">*</span>}
          </p>
          <label className="usa-label" htmlFor={`input-${props.inputId}`}>
            {props.maxAttachments === 1
              ? `Attach a ${new Intl.ListFormat('en', {
                  style: 'short',
                  type: 'disjunction',
                }).format(
                  getFileTypeLabelFromMimes(props.allowedFileTypes)
                )} file`
              : `Attach ${new Intl.ListFormat('en', {
                  style: 'short',
                  type: 'disjunction',
                }).format(
                  getFileTypeLabelFromMimes(props.allowedFileTypes)
                )} files`}
          </label>
          <span className="usa-hint" id={`input-hint-${props.inputId}`}>
            {props.maxAttachments === 1
              ? `Select ${props.maxAttachments} file`
              : `Select up to ${props.maxAttachments} files`}
          </span>
          {(props.error || error) && (
            <span
              className="usa-error-message"
              id={`input-error-message-${props.inputId}`}
              role="alert"
            >
              {props.error?.message || error}
            </span>
          )}
          <div className="usa-file-input">
            <div className="usa-file-input__target">
              {attachments.length === 0 ? (
                <div
                  className="usa-file-input__instructions"
                  aria-hidden="true"
                >
                  Drag file here or{' '}
                  <span className="usa-file-input__choose">
                    choose from folder
                  </span>
                </div>
              ) : (
                <div className="usa-file-input__preview-heading">
                  {attachments.length === 1
                    ? 'Selected file'
                    : `${attachments.length} files selected`}
                  <span className="usa-file-input__choose">
                    Change file{attachments.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <div className="usa-file-input__box"></div>
              {attachments.map((file, index) => (
                <div
                  className="usa-file-input__preview"
                  aria-hidden="true"
                  key={index}
                >
                  <img
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    alt=""
                    className="usa-file-input__preview-image usa-file-input__preview-image--generic"
                  />
                  {file.name}
                </div>
              ))}
              <input
                className={classNames('usa-file-input__input usa-file-input', {
                  'usa-input--error': props.error || error,
                })}
                id={`input-${props.inputId}`}
                aria-describedby={`label-${props.inputId} input-hint-${props.inputId} ${props.error || error ? `input-error-message-${props.inputId}` : null}`}
                onChange={handleChange}
                onBlur={onBlur}
                name={name}
                ref={ref}
                type="file"
                {...(props.maxAttachments === 1 ? {} : { multiple: true })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attachment;

const getFileTypeLabelFromMimes = (mimes: Array<string>) => {
  return attachmentFileTypeOptions
    .filter(option => {
      return mimes.includes(option.value);
    })
    .map(item => {
      return item.label;
    });
};
