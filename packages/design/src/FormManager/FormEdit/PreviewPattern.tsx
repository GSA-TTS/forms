import React, { useEffect, useRef } from 'react';

import { PatternComponent } from '../../Form/index.js';
import { useFormManagerStore } from '../store.js';

export const PreviewPattern: PatternComponent = function PreviewPattern(props) {
  const { context, setFocus } = useFormManagerStore(state => ({
    context: state.context,
    setFocus: state.setFocus,
  }));
  const focus = useFormManagerStore(state => {
    if (state.focus?.pattern.id === props._patternId) {
      return state.focus;
    }
  });
  const focusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      focus &&
      focus.pattern.id === props._patternId &&
      focus.pattern.type !== 'page' &&
      focusRef.current?.scrollIntoView
    ) {
      focusRef.current?.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    }
  }, [focus]);

  const EditComponent = context.editComponents[props.type];
  return (
    <div
      ref={focusRef}
      onClick={event => {
        if (EditComponent && !isPatternEditControlEvent(event)) {
          event.stopPropagation();
          setFocus(props._patternId);
        }
      }}
      onFocus={event => {
        console.log('on focus event', EditComponent);
        if (EditComponent && !isPatternEditControlEvent(event)) {
          event.stopPropagation();
          setFocus(props._patternId);
        }
      }}
    >
      <EditComponent
        context={context}
        previewProps={props}
        childComponents={props.childComponents}
        focus={focus}
      />
    </div>
  );
};

/**
 * Determine if this mouse event corresponds to a pattern edit control, which
 * should not trigger setting the pattern edit focus.
 */
const isPatternEditControlEvent = (
  event:
    | React.MouseEvent<HTMLDivElement, MouseEvent>
    | React.FocusEvent<HTMLDivElement, Element>
) => {
  const patternEditControls = event.currentTarget.querySelectorAll(
    '[data-pattern-edit-control="true"]'
  );
  for (const patternEditControl of patternEditControls) {
    if (
      patternEditControl === event.target ||
      patternEditControl.contains(event.target as HTMLElement)
    ) {
      return true;
    }
  }
  return false;
};
