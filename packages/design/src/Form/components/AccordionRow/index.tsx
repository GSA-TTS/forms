import React, { useState } from 'react';
import classNames from 'classnames';

import { type AccordionRowProps } from '@gsa-tts/forms-core';
import { type PatternComponent } from '../../index.js';

const AccordionRow: PatternComponent<AccordionRowProps> = ({
  inputId,
  title,
  text,
  isOpen = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const contentId = `${inputId}.content`;

  const toggleAccordion = () => {
    setIsExpanded((prev: boolean) => !prev);
  };

  return (
    <div
      className="usa-accordion__row maxw-tablet padding-top-1 padding-bottom-1"
      id={inputId}
    >
      <h4 className="usa-accordion__heading">
        <button
          type="button"
          className={classNames('usa-accordion__button', {
            'usa-accordion__button--expanded': isExpanded,
          })}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={toggleAccordion}
        >
          {title}
        </button>
      </h4>
      {isExpanded && (
        <div id={contentId} className="usa-accordion__content usa-prose">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default AccordionRow;
