import React from 'react';

import { type FormSummaryProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../../Form/index.js';

const FormSummary: PatternComponent<FormSummaryProps> = props => {
  return (
    <>
      <div className="usa-legend-wrapper maxw-tablet">
        {/* <legend className="usa-legend">{pattern.title}</legend> */}
        <h1>{props.title}</h1>
        {props.description !== '' && <p>{props.description}</p>}
      </div>
    </>
  );
};
export default FormSummary;
