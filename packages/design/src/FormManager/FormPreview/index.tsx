import React, { useEffect } from 'react';

import { mergeSession } from '@atj/forms';

import Form from '../../Form/index.js';
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
      const newSession = mergeSession(session, { route: session.route });
      setSession(newSession);
    }
  }, [routeParams]);

  return <Form isPreview={true} context={context} session={session} />;
};
