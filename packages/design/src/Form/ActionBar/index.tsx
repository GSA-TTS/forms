import React from 'react';

import { PromptAction } from '@gsa-tts/forms-core';

export default function ActionBar({ actions }: { actions: PromptAction[] }) {
  return (
    <p className="preview-form-button-wrapper text-right">
      {actions.map((action, index) => {
        if (action.type === 'submit') {
          return (
            <button
              key={index}
              type="submit"
              name="action"
              value={action.submitAction}
              className="usa-button"
            >
              {action.text}
            </button>
          );
        } else if (action.type === 'link') {
          return (
            <a
              key={index}
              href={action.url}
              className="usa-button usa-button--outline"
            >
              {action.text}
            </a>
          );
        }
      })}
    </p>
  );
}
