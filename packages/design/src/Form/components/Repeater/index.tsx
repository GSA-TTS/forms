import React, { Children, useMemo } from 'react';
import { useFieldArray } from 'react-hook-form';
import {
  type RepeaterProps,
  type PromptComponent,
  FormError,
  FormErrors,
} from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../index.js';
import { renderPromptComponents } from '../../form-common.js';

interface RepeaterRowProps {
  children: React.ReactNode[];
  index: number;
  fieldsLength: number;
  patternId: string;
  onDelete: (index: number) => void;
}

const RepeaterRow = ({
  children,
  index,
  fieldsLength,
  patternId,
  onDelete,
}: RepeaterRowProps) => {
  const handleDelete = React.useCallback(() => {
    onDelete(index);
  }, [onDelete, index]);

  return (
    <li
      className="padding-bottom-4 border-bottom border-base-lighter"
      key={index}
    >
      {children.map((child, i) => (
        <React.Fragment key={i}>{child}</React.Fragment>
      ))}
      {fieldsLength > 1 && (
        <button
          type="submit"
          name="action"
          value={`action/repeater-delete-row/${patternId}`}
          className="usa-button usa-button--outline"
          onClick={handleDelete}
        >
          Delete
        </button>
      )}
    </li>
  );
};

interface ChildrenGroups {
  [key: string]: React.ReactNode[];
}

type RepeaterValue = Record<string, unknown>[];

interface ComponentProps {
  props: {
    _patternId?: string;
    id?: string;
    value?: unknown;
    error?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface ChildValue {
  [key: string]: unknown;
}

interface ChildElementProps {
  component: ComponentProps;
  error?: FormError | FormErrors;
  value?: unknown;
  isMailingAddressSameAsPhysical?: boolean;
}

const Repeater: PatternComponent<RepeaterProps> = props => {
  const { fields, append } = useFieldArray({
    name: `${props._patternId}.fields`,
  });

  const groupChildrenByIndex = useMemo(() => {
    const groups: ChildrenGroups = {};

    const children = renderPromptComponents(
      props.context,
      props.childComponents
    );
    Children.forEach(children, (child, idx) => {
      if (!React.isValidElement<ChildElementProps>(child)) return;
      const childrenProps = (props.childComponents as PromptComponent[])[idx]
        .props;
      const patternId = childrenProps._patternId;

      const parts = patternId.split('.');
      const index = parts[1];
      const childId = parts[2];

      const repeaterValues = (props.value as RepeaterValue) || [];
      const rowData = repeaterValues[Number(index)] || {};
      const childValue = rowData[childId];
      const childError = props.error?.fields?.[patternId];

      const enrichedChild = React.cloneElement<ChildElementProps>(
        child as React.ReactElement<ChildElementProps>,
        {
          ...child.props,
          error: childError,
          value: childValue,
          isMailingAddressSameAsPhysical:
            (childValue as ChildValue)?.isMailingAddressSameAsPhysical === 'on',
        }
      );

      if (!groups[index]) groups[index] = [];

      groups[index].push(enrichedChild);
    });

    return groups;
  }, [props.childComponents, props.value, props.error, props._patternId]);

  const hasFields = Object.keys(groupChildrenByIndex).length > 0;

  React.useEffect(() => {
    const groupCount = Object.keys(groupChildrenByIndex).length;
    if (groupCount > fields.length) {
      const diff = groupCount - fields.length;
      Array(diff)
        .fill({})
        .forEach(() => {
          append({});
        });
    } else if (fields.length === 0) {
      append({});
    }
  }, [groupChildrenByIndex, fields.length, append]);

  const handleDelete = React.useCallback(
    (index: number) => {
      const input = document.getElementById(
        `${props._patternId}-delete-index`
      ) as HTMLInputElement;
      if (input) {
        input.value = index.toString();
      }
    },
    [props._patternId]
  );

  const renderRows = useMemo(
    () =>
      fields.map((field, index) => (
        <RepeaterRow
          key={field.id}
          index={index}
          fieldsLength={fields.length}
          patternId={props._patternId}
          onDelete={handleDelete}
        >
          {groupChildrenByIndex[index.toString()] || []}
        </RepeaterRow>
      )),
    [fields, groupChildrenByIndex, props._patternId, handleDelete]
  );

  return (
    <fieldset className="usa-fieldset width-full margin-top-6 margin-bottom-6">
      <input
        type="hidden"
        name="deleteIndex"
        id={`${props._patternId}-delete-index`}
      />

      {props.legend && (
        <legend className="usa-legend text-bold text-uppercase line-height-body-4 width-full margin-top-0 padding-top-3 padding-bottom-1">
          {props.legend}
        </legend>
      )}
      {props.hint && (
        <div className="usa-hint" id={props._patternId}>
          {props.hint}
        </div>
      )}
      {props.error && (
        <div className="usa-error-message" id={props._patternId} role="alert">
          {props.error.message}
        </div>
      )}
      {hasFields && (
        <>
          <ul className="add-list-reset">{renderRows}</ul>
          <div className="usa-button-group margin-left-0 margin-right-0">
            <button
              type="submit"
              name="action"
              value={`action/repeater-add-row/${props._patternId}`}
              className="usa-button usa-button--outline"
            >
              {props.addButtonLabel || 'Add'}
            </button>
          </div>
        </>
      )}
    </fieldset>
  );
};

export default Repeater;
