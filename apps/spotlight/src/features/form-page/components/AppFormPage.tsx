import React, { useEffect } from 'react';
import {
  type Location,
  HashRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';

import { defaultPatternComponents, Form } from '@atj/design';
import { defaultFormConfig, getRouteDataFromQueryString } from '@atj/forms';

import { getAppContext } from '../../../context.js';
import { useFormPageStore } from '../store/index.js';

export const AppFormPage = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/:id" element={<AppFormRoute />} />
      </Routes>
    </HashRouter>
  );
};

const AppFormRoute = () => {
  const { actions, formSessionResponse } = useFormPageStore();
  const { id } = useParams();
  const location = useLocation();
  const ctx = getAppContext();

  if (id === undefined) {
    throw new Error('id is undefined');
  }

  useEffect(
    () =>
      actions.initialize({
        formId: id,
        route: getRouteParamsFromLocation(location),
      }),
    [location, id]
  );
  return (
    <>
      {formSessionResponse.status === 'loading' && <div>Loading...</div>}
      {formSessionResponse.status === 'error' && (
        <div className="usa-alert usa-alert--error" role="alert">
          <div className="usa-alert__body">
            <h4 className="usa-alert__heading">Error loading form</h4>
            <p className="usa-alert__text">{formSessionResponse.message}</p>
          </div>
        </div>
      )}
      {formSessionResponse.status === 'loaded' && (
        <Form
          context={{
            config: defaultFormConfig,
            components: defaultPatternComponents,
            uswdsRoot: ctx.uswdsRoot,
          }}
          session={formSessionResponse.formSession}
          onSubmit={data => {
            actions.onSubmitForm({ formId: id, data });
          }}
        />
      )}
    </>
  );
};

const getRouteParamsFromLocation = (location: Location) => {
  const queryString = location.search.startsWith('?')
    ? location.search.substring(1)
    : location.search;
  return {
    params: getRouteDataFromQueryString(queryString),
    url: `${location.pathname}`,
  };
};
