import React from 'react';

import { type PageSetProps } from '@atj/forms';

import { type PatternComponent } from '../../index.js';
import ActionBar from '../../../Form/ActionBar/index.js';

import { PageMenu } from './PageMenu/index.js';

const PageSet: PatternComponent<PageSetProps> = props => {
  return (
    <div className="grid-row">
      <nav className="tablet:grid-col-3 padding-x-2 tablet:padding-y-3 tablet:padding-right-4 tablet:padding-left-0">
        <PageMenu pages={props.pages} />
      </nav>
      <div
        className="tablet:grid-col-9 tablet:padding-left-4 padding-left-0 padding-bottom-3 padding-top-3 tablet:border-left tablet:border-base-lighter contentWrapper"
        aria-live="polite"
      >
        {props.children}
        <ActionBar actions={props.actions} />
      </div>
    </div>
  );
};

export default PageSet;
