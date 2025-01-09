import React from 'react';
import type { PromptComponent } from '@atj/forms';
import type { FormUIContext } from '../Form/index.js';
import { PreviewPattern } from './FormEdit/PreviewPattern.js';

export const renderEditPromptComponents = (
  context: FormUIContext,
  promptComponents?: PromptComponent[]
) => {
  return promptComponents?.map((promptComponent, index) => {
    //const Component = context.components[promptComponent.props.type];
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
