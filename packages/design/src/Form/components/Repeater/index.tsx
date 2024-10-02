import React, { useState, useEffect } from 'react';
import { type RepeaterProps } from '@atj/forms';
import { type PatternComponent } from '../../../Form/index.js';

const Repeater: PatternComponent<RepeaterProps> = props => {
  const STORAGE_KEY = `repeater-${props._patternId}`;

  const loadInitialFields = (): number => {
    const storedFields = localStorage.getItem(STORAGE_KEY);
    if (storedFields) {
      return parseInt(JSON.parse(storedFields), 10) || 1;
    }
    return 1;
  };

  const [fieldCount, setFieldCount] = useState<number>(loadInitialFields);
  const [fields, setFields] = useState<React.ReactNode[]>([
    React.Children.toArray(props.children),
  ]);
  const hasFields = React.Children.toArray(props.children).length > 0;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.parse(fieldCount.toString()));
    setFields(
      new Array(fieldCount).fill(React.Children.toArray(props.children))
    );
  }, [fieldCount]);

  const handleClone = () => {
    setFieldCount(fieldCount => fieldCount + 1);
  };

  const handleDelete = () => {
    setFieldCount(fieldCount => fieldCount - 1);
  };

  // TODO: need to make this work for non-input types.
  const renderWithUniqueIds = (children: React.ReactNode, index: number) => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child) && child?.props?.component?.props) {
        return React.cloneElement(child, {
          component: {
            ...child.props.component,
            props: {
              ...child.props.component.props,
              idSuffix: `_${index}`,
            },
          },
        });
      }
      return child;
    });
  };

  return (
    <fieldset className="usa-fieldset width-full padding-top-2">
      {props.legend && (
        <legend className="usa-legend text-bold text-uppercase line-height-body-4 width-full margin-top-0 padding-top-3 padding-bottom-1">
          {props.legend}
        </legend>
      )}
      {hasFields ? (
        <>
          <ul className="add-list-reset margin-bottom-4">
            {fields.map((item, index) => {
              return (
                <li
                  key={index}
                  className="padding-bottom-4 border-bottom border-base-lighter"
                >
                  {renderWithUniqueIds(item, index)}
                </li>
              );
            })}
          </ul>
          <div className="usa-button-group margin-bottom-4">
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={handleClone}
            >
              Add new item
            </button>
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={handleDelete}
              disabled={fields.length === 1}
            >
              Delete item
            </button>
          </div>
        </>
      ) : null}
    </fieldset>
  );
};

export default Repeater;
