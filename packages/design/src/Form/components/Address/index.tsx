import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { type AddressComponentProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../index.js';

const AddressPattern: PatternComponent<AddressComponentProps> = ({
  childProps, // Child fields have their own errors
  errors, // Top level pattern errors
  legend,
  required,
  _patternId,
  addMailingAddress,
  isMailingAddressSameAsPhysical,
}) => {
  const { register, setValue, getValues, watch } = useFormContext();
  const [sameAsPhysical, setSameAsPhysical] = useState(
    isMailingAddressSameAsPhysical
  );
  const [childPatternsProps, setChildPatternsProps] = useState(childProps);

  const physicalAddressError = errors?.physical; // Physical address section error
  const [mailingAddressError, setMailingAddressError] = useState(
    errors?.mailing
  ); // Mailing address section error

  const physicalAddressKeys = Object.keys(childPatternsProps)
    .filter(key => key.startsWith('physical'))
    .map(key => `${_patternId}.${key}`);
  const physicalAddressValues = watch(physicalAddressKeys);

  const getAriaDescribedBy = (
    errorId: string | null,
    hintId: string | null
  ): string | undefined => {
    const ids = [errorId, hintId].filter(Boolean).join(' ');
    return ids || undefined;
  };

  const handleSameAsPhysicalChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSameAsPhysical(event.target.checked);
    if (event.target.checked) {
      copyPhysicalToMailing();
    } else {
      resetMailingAddress();
    }
  };

  const copyPhysicalToMailing = () => {
    const formValues = getValues();
    let addressId;
    let addressValues;

    for (const key of Object.keys(formValues)) {
      const value = formValues[key];
      if (
        value &&
        typeof value === 'object' &&
        'physicalStreetAddress' in value
      ) {
        addressValues = value;
        addressId = key;
        break;
      }
    }

    if (addressValues && addressId) {
      Object.entries(addressValues).forEach(([key, value]) => {
        if (key.startsWith('physical') && !key.includes('GooglePlusCode')) {
          const mailingKey = key.replace('physical', 'mailing');
          setValue(`${addressId}.${mailingKey}`, value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });
    }
  };

  const resetMailingAddress = () => {
    const formValues = getValues();
    let addressId;
    let addressValues;

    for (const key of Object.keys(formValues)) {
      const value = formValues[key];
      if (
        value &&
        typeof value === 'object' &&
        'physicalStreetAddress' in value
      ) {
        addressValues = value;
        addressId = key;
        break;
      }
    }

    if (addressValues && addressId) {
      Object.entries(addressValues).forEach(([key]) => {
        if (key.startsWith('mailing')) {
          setValue(`${addressId}.${key}`, '', {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });

      // Reset the error for the mailing address
      setMailingAddressError(undefined);

      // Reset the errors for the mailing address child patterns
      const newChildPatternsProps = { ...childPatternsProps };
      Object.keys({ ...childPatternsProps }).forEach(key => {
        if (key.startsWith('mailing')) {
          newChildPatternsProps[key].error = undefined;
        }
      });

      setChildPatternsProps(newChildPatternsProps);
    }
  };

  useEffect(() => {
    if (sameAsPhysical) {
      copyPhysicalToMailing();
    }
  }, [physicalAddressValues, sameAsPhysical]);

  const formatZipCode = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Format as 99999-9999
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
    }
    return digits;
  };

  const handleZipCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputId: string
  ) => {
    const formattedValue = formatZipCode(event.target.value);
    setValue(inputId, formattedValue);
  };

  const renderFields = (prefix: string) => {
    return Object.entries(childPatternsProps).map(([key, props]) => {
      if (!key.startsWith(prefix)) return null;
      return (
        <React.Fragment key={key}>
          <label className={classNames('usa-label')} htmlFor={props.inputId}>
            {props.label}
            {props.required && <span className="required-indicator">*</span>}
          </label>
          {props.error && (
            <div
              className="usa-error-message"
              id={`error-${props.inputId}`}
              role="alert"
            >
              {props.error?.message}
            </div>
          )}
          {props.type === 'input' ? (
            key.includes('ZipCode') ? (
              <input
                className={classNames('usa-input', {
                  'usa-input--medium': key.includes('ZipCode'),
                  'usa-input--error': !!props.error,
                })}
                defaultValue={props.value}
                {...register(props.inputId)}
                onChange={e => handleZipCodeChange(e, props.inputId)}
                aria-describedby={getAriaDescribedBy(
                  props.error ? `error-${props.inputId}` : null,
                  props.hint ? `hint-${props.inputId}` : null
                )}
              />
            ) : (
              <input
                className={classNames('usa-input', {
                  'usa-input--medium': key.includes('ZipCode'),
                  'usa-input--error': !!props.error,
                })}
                defaultValue={props.value}
                {...register(props.inputId)}
                {...('pattern' in props ? { pattern: props.pattern } : {})}
                aria-describedby={getAriaDescribedBy(
                  props.error ? `error-${props.inputId}` : null,
                  props.hint ? `hint-${props.inputId}` : null
                )}
              />
            )
          ) : (
            <select
              className={classNames('usa-select', {
                'usa-input--error': !!props.error,
              })}
              defaultValue={props.value}
              aria-describedby={getAriaDescribedBy(
                props.error ? `error-${props.inputId}` : null,
                props.hint ? `hint-${props.inputId}` : null
              )}
              {...register(props.inputId)}
            >
              <option value="">- Select -</option>
              {props.options?.map((option, index) => (
                <option key={index} value={option.abbr}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <fieldset className="usa-fieldset width-full">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': physicalAddressError?.type,
        })}
      >
        <div className={classNames('usa-form-group margin-top-2')}>
          <legend
            className={classNames('usa-legend text-bold', {
              'usa-legend--error': physicalAddressError?.type,
            })}
          >
            {legend || 'Physical address'}
            {required && <span className="required-indicator">*</span>}
          </legend>
          <span className="usa-hint pb-2 ">
            Required fields are marked with an asterisk (*).
          </span>
          {physicalAddressError && (
            <div
              className="usa-error-message"
              id={'error-' + _patternId}
              role="alert"
            >
              {physicalAddressError?.message}
            </div>
          )}
          {renderFields('physical')}
        </div>
      </div>
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': mailingAddressError && !sameAsPhysical,
        })}
      >
        {addMailingAddress && (
          <div className="usa-checkbox margin-top-5">
            <input
              className="usa-checkbox__input"
              type="checkbox"
              id={`${_patternId}.isMailingAddressSameAsPhysical`}
              defaultChecked={sameAsPhysical}
              {...register(`${_patternId}.isMailingAddressSameAsPhysical`)}
              onChange={handleSameAsPhysicalChange}
            />
            <label
              className="usa-checkbox__label"
              htmlFor={`${_patternId}.isMailingAddressSameAsPhysical`}
            >
              Mailing address is same as physical address
            </label>
          </div>
        )}
        {addMailingAddress && (
          <div
            className={classNames('usa-form-group margin-top-2', {
              'usa-sr-only': sameAsPhysical, // Visually hide when sameAsPhysical is true
            })}
          >
            <legend
              className={classNames('usa-legend text-bold', {
                'usa-legend--error': mailingAddressError,
              })}
            >
              Mailing address
              {required && <span className="required-indicator">*</span>}
            </legend>
            <span className="usa-hint pb-2 ">
              Required fields are marked with an asterisk (*).
            </span>
            {mailingAddressError && (
              <div
                className="usa-error-message"
                id={'error-' + _patternId}
                role="alert"
              >
                {mailingAddressError?.message}
              </div>
            )}
            {renderFields('mailing')}
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default AddressPattern;
