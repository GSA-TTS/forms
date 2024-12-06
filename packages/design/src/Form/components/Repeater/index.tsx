import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type RepeaterProps } from '@atj/forms';
import { type PatternComponent } from '../../index.js';

const Repeater: PatternComponent<RepeaterProps> = props => {
  const { control } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  const hasFields = React.Children.toArray(props.children).length > 0;

  /**
   * TODO: we want to have an array of objects so it is grouped correctly when submitted
   * child components when submitted need to escalate validation logic to the repeater and rows without
   * any input should not be considered fields that we care about for validation.
   *
   * Each row of the repeater should have its own unique index
   */

  const renderWithUniqueIds = (children: React.ReactNode) => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child) && child?.props?.component?.props) {
        console.group('renderwithuniqueids');
        console.log(child.props);
        console.groupEnd();
        return React.cloneElement(child as React.ReactElement, {
          component: {
            ...child.props.component,
            props: {
              ...child.props.component.props,
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
      {hasFields && (
        <>
          {fields.length ? (
            <ul className="add-list-reset margin-bottom-4">
              {fields.map((field, index) => (
                <li
                  key={field.id}
                  className="padding-bottom-4 border-bottom border-base-lighter"
                >
                  {renderWithUniqueIds(props.children, index)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="usa-prose bg-accent-cool-lighter padding-1 margin-bottom-2">
              <p className="margin-top-0">
                This section is empty. Start by{' '}
                <button
                  type="submit"
                  className="usa-button usa-button--secondary usa-button--unstyled"
                  onClick={e => {
                    e.preventDefault();
                    append({});
                  }}
                >
                  adding an item
                </button>
                .
              </p>
            </div>
          )}
          <div className="usa-button-group margin-bottom-4">
            <button
              type="submit"
              className="usa-button usa-button--outline"
              onClick={e => {
                e.preventDefault();
                append({});
              }}
            >
              Add new item
            </button>
            <button
              type="submit"
              className="usa-button usa-button--outline"
              onClick={e => {
                e.preventDefault();
                remove(fields.length - 1);
              }}
              disabled={fields.length === 0}
            >
              Delete item
            </button>
          </div>
        </>
      )}
    </fieldset>
  );
};

export default Repeater;
