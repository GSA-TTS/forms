import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { AvailableFormList } from '@gsa-tts/forms-design';

import { getAppContext } from '../context.js';
import { getFormManagerUrlById, getFormUrl } from '../routes.js';
import DebugTools from './DebugTools.js';

export default () => {
  const ctx = getAppContext();
  return (
    <ErrorBoundary
      fallback={
        <div>
          <p>There was an unexpected error rendering the form list.</p>
          <DebugTools />
        </div>
      }
    >
      <AvailableFormList
        formService={ctx.formService}
        urlForForm={getFormUrl}
        urlForFormManager={getFormManagerUrlById}
      />
    </ErrorBoundary>
  );
};
