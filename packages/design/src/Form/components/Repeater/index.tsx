import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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

  const { control } = useForm({
    defaultValues: {
      fields: Array(loadInitialFields()).fill({}),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields',
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields.length));
  }, [fields.length]);

  const hasFields = React.Children.toArray(props.children).length > 0;

  const renderWithUniqueIds = (children: React.ReactNode, index: number) => {
    return React.Children.map(children, child => {
      if (React.isValidElement(child) && child?.props?.component?.props) {
        return React.cloneElement(child, {
          component: {
            ...child.props.component,
            props: {
              ...child.props.component.props,
              idSuffix: `.repeater.${index}`,
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
          <div className="usa-button-group margin-bottom-4">
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={() => append({})}
            >
              Add new item
            </button>
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={() => remove(fields.length - 1)}
              disabled={fields.length === 1}
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
