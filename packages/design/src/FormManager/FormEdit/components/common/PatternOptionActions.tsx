import React from 'react';
import { useFormManagerStore } from '../../../store.js';

type PatternOptionActionProps = {
    optionId: string;
    onDelete: (optionId: string) => void;
    ariaLabel?: string;
    title?: string;
};

export const PatternOptionActions: React.FC<PatternOptionActionProps> = ({
    optionId,
    onDelete,
    ariaLabel = 'Delete this option',
    title = 'Delete this option',
}) => {
    const { uswdsRoot } = useFormManagerStore(state => ({
        uswdsRoot: state.context.uswdsRoot,
      }));

      return (
        <button
          type="button"
          aria-label={ariaLabel}
          title={title}
          className="usa-button--outline usa-button--unstyled"
          onClick={event => {
            event.preventDefault();
            const confirmed = window.confirm('Are you sure you want to delete this option?');
            if (confirmed) {
              onDelete(optionId);
            }
          }}
        >
          <svg
            className="usa-icon usa-icon--size-3 margin-1 text-middle"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use xlinkHref={`${uswdsRoot}img/sprite.svg#delete`}></use>
          </svg>
        </button>
      );
    };
    
    export default PatternOptionActions;
