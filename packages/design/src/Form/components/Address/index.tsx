import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { type AddressComponentProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../index.js';

const AddressPattern: PatternComponent<AddressComponentProps> = ({
  childProps,
  error = { physical: undefined, mailing: undefined },
  legend,
  required,
  _patternId,
  addMailingAddress,
}) => {
  const { register, setValue, getValues } = useFormContext();
  const [sameAsPhysical, setSameAsPhysical] = useState(false);

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

    if (event.target.checked) {
      // Copy physical address to mailing address
      if (addressValues && addressId) {
        Object.entries(addressValues).forEach(([key, value]) => {
          if (key.startsWith('physical')) {
            const mailingKey = key.replace('physical', 'mailing');
            setValue(`${addressId}.${mailingKey}`, value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        });
      }
    } else {
      // Reset mailing address to default values
      if (addressValues && addressId) {
        Object.entries(addressValues).forEach(([key]) => {
          if (key.startsWith('mailing')) {
            setValue(`${addressId}.${key}`, childProps[key].value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        });
      }
    }
  };

  useEffect(() => {
    if (sameAsPhysical) {
      handleSameAsPhysicalChange({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [sameAsPhysical]);

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
    return Object.entries(childProps).map(([key, props]) => {
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
                {...register(props.inputId, {
                  required: props.required,
                  onChange: e => handleZipCodeChange(e, props.inputId),
                })}
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
                {...register(props.inputId, {
                  required: props.required,
                })}
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
              {...register(props.inputId, {
                required: props.required,
              })}
              aria-describedby={getAriaDescribedBy(
                props.error ? `error-${props.inputId}` : null,
                props.hint ? `hint-${props.inputId}` : null
              )}
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
          'usa-form-group--error': error?.physical?.type,
        })}
      >
        <div className={classNames('usa-form-group margin-top-2')}>
          <legend
            className={classNames('usa-legend text-bold', {
              'usa-legend--error': error?.physical,
            })}
          >
            {legend || 'Physical address'}
            {required && <span className="required-indicator">*</span>}
          </legend>
          <span className="usa-hint pb-2 ">
            Required fields are marked with an asterisk (*).
          </span>
          {error?.physical && (
            <div
              className="usa-error-message"
              id={'error-' + _patternId}
              role="alert"
            >
              {error.physical.message}
            </div>
          )}
          {renderFields('physical')}
        </div>
      </div>
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': error?.mailing,
        })}
      >
        {addMailingAddress && (
          <div className={classNames('usa-form-group margin-top-2')}>
            <legend
              className={classNames('usa-legend text-bold', {
                'usa-legend--error': error?.mailing,
              })}
            >
              Mailing address
              {required && <span className="required-indicator">*</span>}
            </legend>
            <span className="usa-hint pb-2 ">
              Required fields are marked with an asterisk (*).
            </span>
            {error?.mailing && (
              <div
                className="usa-error-message"
                id={'error-' + _patternId}
                role="alert"
              >
                {error.mailing.message}
              </div>
            )}
            <div className="usa-checkbox">
              <input
                className="usa-checkbox__input"
                type="checkbox"
                id="sameAsPhysical"
                checked={sameAsPhysical}
                onChange={handleSameAsPhysicalChange}
              />
              <label className="usa-checkbox__label" htmlFor="sameAsPhysical">
                Same as physical address
              </label>
            </div>
            {renderFields('mailing')}
          </div>
        )}
      </div>
    </fieldset>
  );
};

export default AddressPattern;
