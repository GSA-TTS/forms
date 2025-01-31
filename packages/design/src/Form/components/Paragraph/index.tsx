import React from 'react';

import { type ParagraphProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../../Form/index.js';

const FormSummary: PatternComponent<ParagraphProps> = props => {
  return (
    <>
      <p className="maxw-tablet">{props.text}</p>
    </>
  );
};
export default FormSummary;
