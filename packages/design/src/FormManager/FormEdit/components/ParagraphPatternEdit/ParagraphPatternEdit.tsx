import classnames from 'classnames';
import React from 'react';

import { enLocale as message } from '@gsa-tts/forms-common';
import { PatternId, type ParagraphProps } from '@gsa-tts/forms-core';
import { type ParagraphPattern } from '@gsa-tts/forms-core';

import Paragraph from '../../../../Form/components/Paragraph/Paragraph.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { useFormManagerStore } from '../../../store.js';

const ParagraphPatternEdit: PatternEditComponent<ParagraphProps> = ({
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
          <Paragraph context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore<ParagraphPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<ParagraphPattern>(patternId);
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
          {message.patterns.paragraph.fieldLabel}
        </label>
        {text.error ? (
          <span className="usa-error-message" role="alert">
            {text.error.message}
          </span>
        ) : null}
        <textarea
          id={fieldId('text')}
          className="usa-textarea bg-primary-lighter"
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

export default ParagraphPatternEdit;
