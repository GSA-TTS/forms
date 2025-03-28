import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { type FormService } from '@gsa-tts/forms-core';

import * as AppRoutes from '../FormManager/routes.js';

type FormDetails = {
  id: string;
  title: string;
  description: string;
};
export type UrlForForm = (id: string) => string;
export type UrlForFormManager = UrlForForm;

export default function AvailableFormList({
  formService,
  urlForForm,
  urlForFormManager,
}: {
  formService: FormService;
  urlForForm: UrlForForm;
  urlForFormManager: UrlForFormManager;
}) {
  const [forms, setForms] = useState<FormDetails[]>([]);
  useEffect(() => {
    formService.getFormList().then(result => {
      if (result.success) {
        setForms(result.data);
      }
    });
  }, []);
  return (
    <>
      <section className="padding-y-3 desktop:margin-top-10 border-base-lighter border-y">
        <div className="grid-container">
          <div className="grid-row flex-justify-center">
            <div className="grid-col-12 tablet:grid-col-12 desktop:grid-col-12">
              <div className="bg-white padding-y-2 padding-x-3 border border-base-lighter">
                <h1>My Forms</h1>
                <FormList
                  forms={forms}
                  urlForForm={urlForForm}
                  urlForFormManager={urlForFormManager}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="grid-container usa-section">
        <p>
          <Link to={AppRoutes.GuidedFormCreation.path} className="usa-button">
            Create New
          </Link>
        </p>
        <p>
          <DebugTools />
        </p>
      </div>
    </>
  );
}

const FormList = ({
  forms,
  urlForForm,
  urlForFormManager,
}: {
  forms: FormDetails[];
  urlForForm: UrlForForm;
  urlForFormManager: UrlForFormManager;
}) => {
  return (
    <table className="usa-table usa-table--stacked form-list-table">
      <thead>
        <tr>
          <th className="mobile-lg:grid-col-4" scope="col">
            Form title
          </th>
          <th className="mobile-lg:grid-col-4" scope="col">
            Description
          </th>
          <th className="mobile-lg:grid-col-4" scope="col">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {!forms.length ? (
          <tr>
            <th data-label="Form title" scope="row">
              There are no forms here yet
            </th>
            <td data-label="Description">{''}</td>
            <td data-label="Actions">{''}</td>
          </tr>
        ) : (
          forms.map((form, index) => (
            <tr key={index}>
              <th data-label="Form title" scope="row">
                {form.title}
              </th>
              <td data-label="Description">{form.description}</td>
              <td data-label="Actions">
                <div className="grid-row grid-gap-md">
                  <a
                    href={urlForForm(form.id)}
                    title={form.title}
                    className="grid-col-auto"
                  >
                    Go to form
                  </a>
                  <a
                    href={`${urlForFormManager(form.id)}/create`}
                    className="grid-col-auto"
                  >
                    Edit
                  </a>
                  <a
                    href={`${urlForFormManager(form.id)}/delete`}
                    className="grid-col-auto"
                  >
                    Delete
                  </a>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

const DebugTools = () => {
  return (
    <button
      className="usa-button"
      onClick={() => {
        console.warn('clearing localStorage...');
        window.localStorage.clear();
        window.location.reload();
      }}
    >
      Delete all demo data (clear browser local storage)
    </button>
  );
};
