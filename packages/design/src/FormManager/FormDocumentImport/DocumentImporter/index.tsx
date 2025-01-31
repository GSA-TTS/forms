import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type DocumentFieldMap,
  type Blueprint,
  type FormService,
  addDocument,
  addDocumentFieldsToForm,
  createFormSession,
} from '@gsa-tts/forms-core';

import Form, { FormUIContext } from '../../../Form/index.js';
import { onFileInputChangeGetFile } from '../../FormList/CreateNew/file-input.js';

const DocumentImporter = ({
  baseUrl,
  formId,
  context,
  form,
  formService,
}: {
  baseUrl: string;
  formId: string;
  context: FormUIContext;
  form: Blueprint;
  formService: FormService;
}) => {
  const { state, actions } = useDocumentImporter(formService, form, baseUrl);

  const CreateNew = () => {
    return (
      <div className="usa-form-group">
        <label
          className="usa-label"
          id="file-input-specific-hint"
          htmlFor="file-input-specific"
        >
          Select a single PDF file
        </label>
        <div className="usa-file-input">
          <div className="usa-file-input__target">
            <div className="usa-file-input__instructions" aria-hidden="true">
              Drag file here or{' '}
              <span className="usa-file-input__choose">choose from folder</span>
            </div>
            <div className="usa-file-input__box"></div>
            <input
              className="usa-file-input__input"
              id="file-input-specific"
              aria-describedby="file-input-specific-hint"
              type="file"
              accept=".pdf"
              onChange={onFileInputChangeGetFile(async fileDetails => {
                actions.stepOneSelectPdfByUpload(fileDetails);
              })}
            />
          </div>
        </div>
      </div>
    );
  };

  const ButtonBar = () => {
    return (
      <div>
        <button className="usa-button">Next</button>
      </div>
    );
  };

  const BuildFormPage = () => {
    return (
      <form
        className="usa-form usa-form--large"
        onSubmit={() => {
          actions.stepTwoConfirmFields();
        }}
      >
        {/*<EditFieldset fields={state.suggestedForm} />*/}
        <ul>
          {Object.values(state.documentFields || {}).map((field, index) => {
            return <li key={index}>{JSON.stringify(field)}</li>;
          })}
        </ul>
        <ButtonBar />
      </form>
    );
  };
  const PreviewFormPage = () => {
    const previewForm = addDocumentFieldsToForm(
      form,
      state.documentFields || {}
    );
    return (
      <>
        <Form
          context={context}
          session={createFormSession(previewForm)}
          onSubmit={data => {
            //handleFormSubmission(formId, data);
            console.log(formId, data);
          }}
        />
        <form
          className="usa-form usa-form--large"
          onSubmit={() => {
            actions.stepThreeSaveForm(formId);
          }}
        >
          <ButtonBar />
        </form>
      </>
    );
  };

  return (
    <div>
      <h1>Import a PDF</h1>
      {state.page === 1 && <CreateNew />}
      {state.page === 2 && <BuildFormPage />}
      {state.page === 3 && <PreviewFormPage />}
    </div>
  );
};

type State = {
  page: number;
  previewForm: Blueprint;
  documentFields?: DocumentFieldMap;
};

const useDocumentImporter = (
  formService: FormService,
  form: Blueprint,
  baseUrl: string
) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(
    (
      state: State,
      action:
        | {
            type: 'SELECT_PDF';
            data: {
              path: string;
              fields: DocumentFieldMap;
              previewForm: Blueprint;
            };
          }
        | {
            type: 'PREVIEW_FORM';
          }
        | {
            type: 'GOTO_PAGE';
            page: number;
          }
    ) => {
      if (action.type === 'SELECT_PDF') {
        return {
          page: 2,
          previewForm: action.data.previewForm,
          documentFields: action.data.fields,
        };
      }
      if (action.type === 'PREVIEW_FORM') {
        return {
          page: 3,
          documentFields: state.documentFields,
          previewForm: state.previewForm,
        };
      }
      if (action.type === 'GOTO_PAGE') {
        return {
          ...state,
          page: action.page,
          previewForm: state.previewForm,
          documentFields: state.documentFields,
        };
      }
      return state;
    },
    {
      page: 1,
      previewForm: form,
    }
  );
  return {
    state,
    actions: {
      async stepOneSelectPdfByUrl(url: string) {
        const completeUrl = `${baseUrl}${url}`;
        const response = await fetch(completeUrl);
        const blob = await response.blob();
        const data = new Uint8Array(await blob.arrayBuffer());

        const { newFields, updatedForm } = await addDocument(
          state.previewForm,
          {
            name: url,
            data,
          }
        );
        dispatch({
          type: 'SELECT_PDF',
          data: {
            path: url,
            fields: newFields,
            previewForm: updatedForm,
          },
        });
      },
      async stepOneSelectPdfByUpload(fileDetails: {
        name: string;
        data: Uint8Array;
      }) {
        const { newFields, updatedForm } = await addDocument(
          state.previewForm,
          fileDetails
        );
        dispatch({
          type: 'SELECT_PDF',
          data: {
            path: fileDetails.name,
            fields: newFields,
            previewForm: updatedForm,
          },
        });
      },
      stepTwoConfirmFields() {
        dispatch({
          type: 'PREVIEW_FORM',
        });
      },
      stepThreeSaveForm(formId: string) {
        formService.saveForm(formId, state.previewForm);
        navigate(`/${formId}/create`);
      },
      gotoPage(step: number) {
        dispatch({ type: 'GOTO_PAGE', page: step });
      },
    },
  };
};

export default DocumentImporter;
