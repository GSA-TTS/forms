import React from 'react';

import { type RichTextProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../types.js';
import styles from './richTextStyles.module.css';

const FormSummary: PatternComponent<RichTextProps> = props => {
  return (
    <div className={`${styles.richTextEditorWrapper}`}>
      <div dangerouslySetInnerHTML={{ __html: props.text }} />
    </div>
  );
};
export default FormSummary;
