import React from 'react';
import classnames from 'classnames';

import { type AddressComponentProps } from '@atj/forms';
import { type AddressPattern } from '@atj/forms';

import Address from '../../../../Form/components/Address/index.js';
import { PatternEditComponent } from '../../types.js';

import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { enLocale as message } from '@atj/common';
import styles from '../../formEditStyles.module.css';

const AddressPatternEdit: PatternEditComponent<AddressComponentProps> = ({
  context,
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent pattern={focus.pattern} />}
        ></PatternEditForm>
      ) : (
        <div
          className={`${styles.addressPattern} padding-left-3 padding-bottom-3 padding-right-3`}
        >
          <Address context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

const EditComponent = ({ pattern }: { pattern: AddressPattern }) => {
  const { fieldId, getFieldState, register } =
    usePatternEditFormContext<AddressPattern>(pattern.id);
  const legend = getFieldState('legend');
  const addMailingAddress = getFieldState('addMailingAddress');

  return (
    <div className="grid-row grid-gap">
      <div className="tablet:grid-col-12 mobile-lg:grid-col-12 margin-bottom-2">
        <label
          className={classnames('usa-label', {
            'usa-label--error': legend.error,
          })}
        >
          {message.patterns.address.fieldLabel}
          {legend.error ? (
            <span className="usa-error-message" role="alert">
              {legend.error.message}
            </span>
          ) : null}
          <input
            className="usa-input"
            id={fieldId('legend')}
            defaultValue={pattern.data.legend}
            {...register('legend')}
            type="text"
            autoFocus
          />
        </label>
        <span className="usa-checkbox">
          <input
            style={{ display: 'inline-block' }}
            className="usa-checkbox__input bg-primary-lighter"
            type="checkbox"
            id={fieldId('addMailingAddress')}
            {...register('addMailingAddress')}
            defaultChecked={pattern.data.addMailingAddress}
          />
          <label
            style={{ display: 'inline-block' }}
            className="usa-checkbox__label"
            htmlFor={fieldId('addMailingAddress')}
          >
            Add Mailing Address
          </label>
          {addMailingAddress.error && (
            <span className="usa-error-message" role="alert">
              {addMailingAddress.error.message}
            </span>
          )}
        </span>
      </div>
      <div className="grid-col-12">
        <PatternEditActions>
          <span className="usa-checkbox">
            <input
              style={{ display: 'inline-block' }}
              className="usa-checkbox__input bg-primary-lighter"
              type="checkbox"
              id={fieldId('required')}
              {...register('required')}
              defaultChecked={pattern.data.required}
            />
            <label
              style={{ display: 'inline-block' }}
              className="usa-checkbox__label"
              htmlFor={fieldId('required')}
            >
              Required
            </label>
          </span>
        </PatternEditActions>
      </div>
    </div>
  );
};

export default AddressPatternEdit;
