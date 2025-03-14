import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { type AddressComponentProps } from '@gsa-tts/forms-core';

import { type PatternComponent } from '../../index.js';

const AddressPattern: PatternComponent<AddressComponentProps> = ({
  childProps,
  error,
  value,
  legend,
  required,
  _patternId,
  addMailingAddress,
  isMailingAddressSameAsPhysical,
}) => {
  const getAriaDescribedBy = (
    errorId: string | null,
    hintId: string | null
  ): string | undefined => {
    const ids = [errorId, hintId].filter(Boolean).join(' ');
    return ids || undefined;
  };

  const enrichedChildProps = Object.entries(childProps).reduce(
    (acc, [key, child]) => {
      acc[key] = {
        ...child,
        error: error?.fields?.[key],
        value: value?.[key],
      };

      return acc;
    },
    {} as typeof childProps
  );

  const { register, setValue, getValues, watch } = useFormContext();
  const [sameAsPhysical, setSameAsPhysical] = useState(
    isMailingAddressSameAsPhysical
  );
  const [childPatternsProps, setChildPatternsProps] =
    useState(enrichedChildProps);

  const physicalAddressError = error?.fields?._physical; // Physical address section error
  const [mailingAddressError, setMailingAddressError] = useState(
    error?.fields?._mailing
  ); // Mailing address section error

  const physicalAddressKeys = Object.keys(childPatternsProps)
    .filter(key => key.startsWith('physical'))
    .map(key => `${_patternId}.${key}`);
  const physicalAddressValues = watch(physicalAddressKeys);

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

  const processAddress = (isReset: boolean) => {
    const extractAddressValues = (patternId: string) => {
      const formValues = getValues();
      const idParts = patternId.split('.');
      const [parentKey, index, childId] = idParts;
      const currentParentValues = formValues[parentKey];

      const addressValues =
        currentParentValues?.[index]?.[childId] ?? currentParentValues;
      const addressId = patternId;

      return { addressValues, addressId };
    };

    const { addressValues, addressId } = extractAddressValues(_patternId);

    if (addressValues && addressId) {
      Object.entries(addressValues).forEach(([key, value]) => {
        if (
          key.startsWith(isReset ? 'mailing' : 'physical') &&
          !key.includes('GooglePlusCode')
        ) {
          const mailingKey = key.replace('physical', 'mailing');
          setValue(`${addressId}.${mailingKey}`, isReset ? '' : value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      });

      if (isReset) {
        setMailingAddressError(undefined);
        const newChildPatternsProps = { ...childPatternsProps };
        Object.keys(newChildPatternsProps).forEach(key => {
          if (key.startsWith('mailing')) {
            newChildPatternsProps[key].error = undefined;
          }
        });
        setChildPatternsProps(newChildPatternsProps);
      }
    }
  };

  const copyPhysicalToMailing = () => {
    processAddress(false);
  };

  const resetMailingAddress = () => {
    processAddress(true);
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
