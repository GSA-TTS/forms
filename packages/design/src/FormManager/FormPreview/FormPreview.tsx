import React, { useEffect } from 'react';

import { mergeSession } from '@gsa-tts/forms-core';

import Form from '../../Form/Form.js';
import { useRouteParams } from '../hooks.js';
import { useFormManagerStore } from '../store.js';

export const FormPreview = () => {
  const { context, setSession } = useFormManagerStore(state => ({
    context: state.context,
    setSession: state.setSession,
  }));
  const session = useFormManagerStore(state => state.session);
  const { routeParams } = useRouteParams();

  useEffect(() => {
    if (routeParams.page !== session.route?.params.page) {
      const newSession = mergeSession(session, {
        route: {
          ...session.route,
          params: { ...routeParams },
          url: session.route?.url || '',
        },
      });
      setSession(newSession);
    }
  }, [routeParams.page]);

  return <Form isPreview={true} context={context} session={session} />;
};
