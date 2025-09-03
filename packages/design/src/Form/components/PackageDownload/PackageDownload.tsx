import React from 'react';

import { type PackageDownloadProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../types.js';
import ActionBar from '../../ActionBar/index.js';

const PackageDownload: PatternComponent<PackageDownloadProps> = props => {
  return (
    <>
      <p className="maxw-tablet">{props.text}</p>
      <ActionBar actions={props.actions} />
    </>
  );
};
export default PackageDownload;
