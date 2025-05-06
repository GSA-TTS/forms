import React from 'react';
import type { PromptComponent } from '@gsa-tts/forms-core';
import type { FormUIContext } from '../Form/types.js';
import { PreviewPattern } from './FormEdit/PreviewPattern.js';

export const renderEditPromptComponents = (
  context: FormUIContext,
  promptComponents?: PromptComponent[]
) => {
  return promptComponents?.map((promptComponent, index) => {
    return (
      <PreviewPattern
        key={index}
        {...promptComponent.props}
        context={context}
        childComponents={promptComponent.children}
      />
    );
  });
};
