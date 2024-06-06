import React, { useEffect } from 'react';

import { mergeSession } from '@atj/forms';

import Form from '../../Form';
import { useFormManagerStore } from '../store';
import { useRouteParams } from '../../FormRouter/hooks';

export const FormPreview = () => {
  const { context, setSession } = useFormManagerStore(state => ({
    context: state.context,
    setSession: state.setSession,
  }));
  const session = useFormManagerStore(state => state.session);
  const { routeParams } = useRouteParams();

  useEffect(() => {
    if (routeParams.page !== session.routeParams?.page) {
      const newSession = mergeSession(session, { routeParams });
      setSession(newSession);
    }
  }, [routeParams]);

  return <Form isPreview={true} context={context} session={session} />;
};
