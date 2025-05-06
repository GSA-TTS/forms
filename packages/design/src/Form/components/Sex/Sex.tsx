import React, { useState } from 'react';
import classNames from 'classnames';
import { useFormContext } from 'react-hook-form';
import { type PatternComponent } from '../../types.js';
import { type SexProps } from '@gsa-tts/forms-core';
import Modal from './Modal.js';

const getAriaDescribedBy = (hintId: string | null) => hintId || undefined;

const SexPattern: PatternComponent<SexProps> = ({
  sexId,
  label,
  required,
  helperText,
  error,
  value,
}) => {
  const { register } = useFormContext();
  const helperTextId = `helper-text-${sexId}`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <fieldset className="usa-fieldset">
      <div
        className={classNames('usa-form-group margin-top-2', {
          'usa-form-group--error': error,
        })}
      >
        <label className="usa-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        <span className="usa-hint" id={helperTextId}>
          Please select your sex from the following options.&nbsp;
          <a href="#sex-data-transparency-statement" onClick={handleOpenModal}>
            Why do we ask for sex information?
          </a>
        </span>
        {error && (
          <div className="usa-error-message" id={`error-${sexId}`} role="alert">
            {error?.message}
          </div>
        )}

        <div className="usa-radio">
          <input
            className="usa-radio__input"
            id={`${sexId}.male`}
            type="radio"
            value="male"
            {...register(sexId, { required })}
            defaultChecked={value === 'male'}
            aria-describedby={getAriaDescribedBy(helperTextId)}
          />
          <label className="usa-radio__label" htmlFor={`${sexId}.male`}>
            Male
          </label>
        </div>

        <div className="usa-radio">
          <input
            className="usa-radio__input"
            id={`${sexId}.female`}
            type="radio"
            value="female"
            {...register(sexId, { required })}
            defaultChecked={value === 'female'}
            aria-describedby={getAriaDescribedBy(helperTextId)}
          />
          <label className="usa-radio__label" htmlFor={`${sexId}.female`}>
            Female
          </label>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        helperText={helperText}
      />
    </fieldset>
  );
};

export default SexPattern;
