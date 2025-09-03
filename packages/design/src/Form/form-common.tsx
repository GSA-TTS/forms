import React from 'react';
import type { PromptComponent } from '@gsa-tts/forms-core';
import type { FormUIContext } from './types.js';

export const renderPromptComponents = (
  context: FormUIContext,
  promptComponents?: PromptComponent[]
) => {
  return promptComponents?.map((promptComponent, index) => {
    const Component = context.components[promptComponent.props.type];
    return (
      <Component
        key={index}
        {...promptComponent.props}
        context={context}
        childComponents={promptComponent.children}
      />
    );
  });
};
