import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { AvailableFormList } from '@gsa-tts/forms-design';

import { type AppContext } from '../config/context.js';
import { getFormManagerUrlById, getFormUrl } from '../routes.js';
import DebugTools from './DebugTools.js';

export default ({ ctx }: { ctx: AppContext }) => {
  return (
    <ErrorBoundary
      fallback={
        <div>
          There was an unexpected error rendering the form list.
          <DebugTools />
        </div>
      }
    >
      <AvailableFormList
        urlForFormManager={formId => getFormManagerUrlById(ctx.baseUrl, formId)}
        formService={ctx.formService}
        urlForForm={formId => getFormUrl(ctx.baseUrl, formId)}
      />
    </ErrorBoundary>
  );
};
