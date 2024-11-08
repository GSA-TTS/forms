import React from 'react';

import { defaultPatternComponents, Form } from '@atj/design';
import { type FormSession, defaultFormConfig } from '@atj/forms';

type AppFormProps = {
  uswdsRoot: `${string}/`;
  session: FormSession;
};

export const AppForm = (props: AppFormProps) => {
  return (
    <Form
      context={{
        config: defaultFormConfig,
        components: defaultPatternComponents,
        uswdsRoot: props.uswdsRoot,
      }}
      session={props.session}
    />
  );
};
