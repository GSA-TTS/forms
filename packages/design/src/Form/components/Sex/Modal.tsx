import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import ReactDOM from 'react-dom';
import {
  modalWrapperStyle,
  modalOverlayStyle,
  modalStyle,
  modalContentStyle,
  modalMainStyle,
  modalHeadingStyle,
  modalFooterStyle,
  buttonStyle,
  closeButtonStyle,
  modalProseStyle,
  modalParagraphStyle,
} from './modalStyles.js';

const ModalCloseButton = ({
  onClick,
  style,
}: {
  onClick: () => void;
  style: React.CSSProperties;
}) => (
  <button onClick={onClick} aria-label="Close this window" style={style}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18"
        stroke="gray"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="gray"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  helperText: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, helperText }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={classNames('usa-modal-wrapper', {
        'is-visible': isOpen,
        'is-hidden': !isOpen,
      })}
      style={modalWrapperStyle(isOpen) as React.CSSProperties}
      role="dialog"
      aria-modal="true"
      id="sex-data-transparency-statement"
      aria-labelledby="sex-data-transparency-statement-heading"
      aria-describedby="sex-data-transparency-statement-description"
    >
      <div
        className="usa-modal-overlay"
        onClick={onClose}
        style={modalOverlayStyle as React.CSSProperties}
      >
        <div
          className="usa-modal"
          tabIndex={-1}
          style={modalStyle as React.CSSProperties}
        >
          <div
            className="usa-modal__content"
            style={modalContentStyle as React.CSSProperties}
          >
            <ModalCloseButton
              onClick={onClose}
              style={closeButtonStyle as React.CSSProperties}
            />
            <div
              className="usa-modal__main"
              style={modalMainStyle as React.CSSProperties}
            >
              <h4
                className="usa-modal__heading"
                id="sex-data-transparency-statement-heading"
                style={modalHeadingStyle}
              >
                Why do we ask for sex information?
              </h4>
              <div
                className="usa-prose"
                style={modalProseStyle as React.CSSProperties}
              >
                <p
                  id="sex-data-transparency-statement-description"
                  style={modalParagraphStyle}
                >
                  {helperText}
                </p>
              </div>
              <div className="usa-modal__footer" style={modalFooterStyle}>
                <button
                  type="button"
                  className="usa-button"
                  onClick={onClose}
                  style={buttonStyle as React.CSSProperties}
                >
                  Return to the form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
