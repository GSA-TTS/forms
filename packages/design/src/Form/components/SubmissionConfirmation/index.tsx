import React from 'react';

import { type SubmissionConfirmationProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../../Form/index.js';

const SubmissionConfirmation: PatternComponent<
  SubmissionConfirmationProps
  // eslint-disable-next-line
> = props => {
  return (
    <>
      <legend className="usa-legend usa-legend--large">
        Submission confirmation
      </legend>
      <div className="usa-alert usa-alert--success margin-bottom-2">
        <div className="usa-alert__body">
          <h4 className="usa-alert__heading">Submission complete</h4>
          <p className="usa-alert__text">
            Thank you for submitting your filing. Your document package has been
            auto-downloaded.
          </p>
        </div>
      </div>
      <h2>Next steps:</h2>
      <div className="margin-bottom-4">
        <ul className="usa-list">
          <li>Print your document package</li>
          <li>Review your documents for accuracy</li>
          <li>Follow the instructions on the first page of your package</li>
        </ul>
      </div>
      <div className="usa-accordion">
        <h4 className="usa-accordion__heading">
          <button
            type="button"
            className="usa-accordion__button"
            aria-expanded={false}
            aria-controls="submission-confirmation-table"
          >
            Submission details
          </button>
        </h4>
        {/*
          EG: turn this off for now. Will need some design perhaps to see what the presentation
          should look like. This was a minimal blocker for the repeater field due to the flat data structure
          that was there previously.
        */}
        {/*<div*/}
        {/*  id="submission-confirmation-table"*/}
        {/*  className="usa-accordion__content usa-prose"*/}
        {/*  hidden={true}*/}
        {/*>*/}
        {/*  <table className="usa-table usa-table--striped width-full">*/}
        {/*    <thead>*/}
        {/*      <tr>*/}
        {/*        <th scope="col">Form field</th>*/}
        {/*        <th scope="col">Provided value</th>*/}
        {/*      </tr>*/}
        {/*    </thead>*/}
        {/*    <tbody>*/}
        {/*      {props.table.map((row, index) => {*/}
        {/*        return (*/}
        {/*          <tr key={index}>*/}
        {/*            <th scope="row">{row.label}</th>*/}
        {/*            <td>{row.value}</td>*/}
        {/*          </tr>*/}
        {/*        );*/}
        {/*      })}*/}
        {/*    </tbody>*/}
        {/*  </table>*/}
        {/*</div>*/}
      </div>
    </>
  );
};

export default SubmissionConfirmation;
