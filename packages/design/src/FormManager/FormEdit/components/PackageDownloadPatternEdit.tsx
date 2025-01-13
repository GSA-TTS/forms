import classnames from 'classnames';
import React from 'react';

import { enLocale as message } from '@atj/common';
import {
  type PackageDownloadPattern,
  type PackageDownloadProps,
  type PatternId,
} from '@atj/forms';

import PackageDownload from '../../../Form/components/PackageDownload/index.js';
import { PatternEditComponent } from '../types.js';

import { PatternEditActions } from './common/PatternEditActions.js';
import { PatternEditForm } from './common/PatternEditForm.js';
import { usePatternEditFormContext } from './common/hooks.js';
import { useFormManagerStore } from '../../store.js';

const PackageDownloadPatternEdit: PatternEditComponent<
  PackageDownloadProps
> = ({ context, focus, previewProps }) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent patternId={focus.pattern.id} />}
        ></PatternEditForm>
      ) : (
        <div className="padding-left-3 padding-bottom-3 padding-right-3">
          <PackageDownload context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore<PackageDownloadPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<PackageDownloadPattern>(patternId);
  const text = getFieldState('text');

  return (
    <div className="grid-row grid-gap-1">
      <div className="tablet:grid-col-12">
        <label
          className={classnames('usa-label', {
            'usa-label--error': text.error,
          })}
          htmlFor={fieldId('text')}
        >
          {message.patterns.packageDownload.fieldLabel}
        </label>
        {text.error ? (
          <span className="usa-error-message" role="alert">
            {text.error.message}
          </span>
        ) : null}
        <textarea
          id={fieldId('text')}
          className="usa-textarea bg-primary-lighter text-bold"
          style={{ height: 'unset' }}
          rows={4}
          {...register('text')}
          defaultValue={pattern.data.text}
          autoFocus
        ></textarea>
      </div>
      <PatternEditActions />
    </div>
  );
};

export default PackageDownloadPatternEdit;
