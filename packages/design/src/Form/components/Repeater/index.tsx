import React, { useState } from 'react';
import { type RepeaterProps } from '@atj/forms';
import { type PatternComponent } from '../../../Form/index.js';

const Repeater: PatternComponent<RepeaterProps> = props => {
  // Using state to store and manage children elements
  const [fields, setFields] = useState<React.ReactNode[]>([
    React.Children.toArray(props.children),
  ]);

  // // Load initial state from localStorage if available
  // useEffect(() => {
  //   const storedChildren = localStorage.getItem('repeaterChildren');
  //   if (storedChildren) {
  //     setFields(JSON.parse(storedChildren));
  //   }
  // }, []);

  // // Sync state with localStorage
  // useEffect(() => {
  //   localStorage.setItem('repeaterChildren', JSON.stringify(children));
  // }, [children]);

  // Handler to clone children
  const handleClone = () => {
    setFields([...fields, [React.Children.toArray(props.children)]]);
  };

  // Handler to delete children
  const handleDelete = (index: number) => {
    setFields(fields => [
      ...fields.slice(0, index),
      ...fields.slice(index + 1),
    ]);
  };

  return (
    <fieldset className="usa-fieldset width-full padding-top-2">
      {props.legend && (
        <legend className="usa-legend text-bold text-uppercase line-height-body-4 width-full margin-top-0 padding-top-3 padding-bottom-1">
          {props.legend}
        </legend>
      )}
      {fields ? (
        <>
          <ul className="add-list-reset">
            {fields.map((item, index) => {
              return (
                <li
                  key={index}
                  className="padding-bottom-2 border-bottom border-base-lighter"
                >
                  {item}
                  <p>
                    <button
                      type="button"
                      className="usa-button usa-button--outline"
                      onClick={() => handleDelete(index)}
                      disabled={fields.length === 1}
                    >
                      Delete item
                    </button>
                  </p>
                </li>
              );
            })}
          </ul>
          <p>
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={handleClone}
            >
              Add new item
            </button>
          </p>
        </>
      ) : null}
    </fieldset>
  );
};

export default Repeater;
