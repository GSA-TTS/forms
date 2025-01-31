import React from 'react';

import { defaultPatternComponents, Form } from '@gsa-tts/forms-design';
import { type FormSession, defaultFormConfig } from '@gsa-tts/forms-core';

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
