import React from 'react';

import { type FieldsetProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../index.js';
import { renderPromptComponents } from '../../form-common.js';
import classNames from 'classnames';

const Fieldset: PatternComponent<FieldsetProps> = props => {
  return (
    <fieldset className="usa-fieldset width-full padding-top-2">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': props.error,
        })}
      >
        {props.legend !== '' && props.legend !== undefined && (
          <legend className="usa-legend text-bold text-uppercase line-height-body-4 width-full margin-top-0 padding-top-3 padding-bottom-1">
            {props.legend}
          </legend>
        )}
        {props.hint && (
          <div className="usa-hint" id={props._patternId}>
            {props.hint}
          </div>
        )}
        {props.error && (
          <div className="usa-error-message" id={props._patternId} role="alert">
            {props.error.message}
          </div>
        )}
        {renderPromptComponents(props.context, props.childComponents)}
      </div>
    </fieldset>
  );
};
export default Fieldset;
