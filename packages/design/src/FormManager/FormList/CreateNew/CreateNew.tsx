import React from 'react';
import { useNavigate } from 'react-router-dom';

import { SAMPLE_DOCUMENTS } from '@gsa-tts/forms-core';

import { useFormManagerStore } from '../../store.js';
import { onFileInputChangeGetFile } from './file-input.js';
import { Notifications } from '../../Notifications/index.js';

export default function CreateNew() {
  const navigate = useNavigate();
  const actions = useFormManagerStore(state => ({
    context: state.context,
    createNewForm: state.createNewForm,
    createNewFormByPDFUpload: state.createNewFormByPDFUpload,
    createNewFormByPDFUrl: state.createNewFormByPDFUrl,
    addNotification: state.addNotification,
  }));

  const handleSampleDocumentImport = async (url: string) => {
    try {
      const result = await actions.createNewFormByPDFUrl(url);
      if (result.success) {
        navigate(`/${result.data}/create`, {
          state: {
            result,
          },
        });
      } else {
        // show error toast
        actions.addNotification(
          'error',
          'Sorry, but there was an error importing the form.'
        );
      }
    } catch (e: unknown) {
      // show error toast
      if ((e as Error).message) {
        actions.addNotification('error', (e as Error).message);
      }
    }
  };

  return (
    <>
      <Notifications />
      <ul className="usa-card-group">
        <li className="usa-card tablet:grid-col-6">
          <div className="usa-card__container border-1px border-base-lighter radius-md">
            <div className="usa-card__header">
              <h2 className="usa-card__heading">Start from Scratch</h2>
            </div>
            <div className="usa-card__media bg-primary-lighter">
              <div className="usa-card__img bg-primary-lighter">
                <svg
                  className="usa-icon usa-icon--size-9 margin-y-3 margin-x-auto text-middle display-block bg-blue-vivid-60 text-primary"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                >
                  <use
                    xlinkHref={`${actions.context.uswdsRoot}img/sprite.svg#add`}
                  ></use>
                </svg>
              </div>
            </div>
            <div className="usa-card__body margin-bottom-4">
              <p>Jump in and build your form from an empty canvas.</p>
            </div>
            <div className="usa-card__footer">
              <button
                className="usa-button"
                onClick={async () => {
                  const result = await actions.createNewForm();
                  if (result.success) {
                    navigate(`/${result.data}/create`);
                  }
                }}
              >
                Create New
              </button>
            </div>
          </div>
        </li>
        <li className="usa-card tablet:grid-col-6">
          <div className="usa-card__container border-1px border-base-lighter radius-md">
            <div className="usa-card__header">
              <h2 className="usa-card__heading">Start from Import</h2>
            </div>
            <div className="usa-card__media bg-primary-lighter">
              <div className="usa-card__img bg-primary-lighter">
                <svg
                  className="usa-icon usa-icon--size-9 margin-y-3 margin-x-auto text-middle display-block bg-blue-vivid-60 text-primary"
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                >
                  <use
                    xlinkHref={`${actions.context.uswdsRoot}img/sprite.svg#upload_file`}
                  ></use>
                </svg>
              </div>
            </div>
            <div className="usa-card__body margin-bottom-4">
              <p>Mold your new form from imported pdf contents.</p>
            </div>
            <div className="usa-card__footer">
              <div className="usa-file-input usa-sr-only">
                <div className="usa-sr-only" aria-live="polite">
                  No files selected.
                </div>
                <div className="usa-file-input__target">
                  <div className="usa-file-input__box"></div>
                  <div
                    className="usa-file-input__instructions"
                    aria-hidden="true"
                  >
                    Drag file here or{' '}
                    <span className="usa-file-input__choose">
                      choose from folder
                    </span>
                  </div>

                  <input
                    className="usa-file-input__input"
                    id="file-input-specific"
                    aria-describedby="file-input-specific-hint"
                    type="file"
                    accept=".pdf"
                    onChange={onFileInputChangeGetFile(async fileDetails => {
                      const result =
                        await actions.createNewFormByPDFUpload(fileDetails);
                      if (result.success) {
                        navigate(`/${result.data}/create`, {
                          state: {
                            result,
                          },
                        });
                      }
                    })}
                  />
                </div>
              </div>
              <label
                className="usa-button"
                id="file-input-specific-hint"
                htmlFor="file-input-specific"
              >
                Upload File
              </label>
            </div>
          </div>
        </li>
      </ul>
      <div className="usa-section">
        <details>
          <summary>
            Or use an example file, selected for testing purposes:
          </summary>
          <ul>
            {SAMPLE_DOCUMENTS.map((file, index) => (
              <li key={index}>
                <SampleDocumentButton
                  callback={handleSampleDocumentImport}
                  documentPath={file.path}
                />
              </li>
            ))}
          </ul>
        </details>
      </div>
    </>
  );
}

const SampleDocumentButton = ({
  callback,
  documentPath,
}: {
  callback: (path: string) => Promise<void>;
  documentPath: string;
}) => {
  return (
    <button
      className="usa-button--unstyled"
      onClick={async () => {
        await callback(documentPath);
      }}
    >
      {documentPath}
    </button>
  );
};
