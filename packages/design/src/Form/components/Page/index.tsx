import React from 'react';

import { type PageProps } from '@atj/forms';

import { type PatternComponent } from '../../index.js';
import { renderPromptComponents } from '../../form-common.js';

const Page: PatternComponent<PageProps> = props => {
  return <>{renderPromptComponents(props.context, props.childComponents)}</>;
};

export default Page;
