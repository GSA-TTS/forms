import React, { useEffect, useState } from 'react';
import {
  useParams,
  HashRouter,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';

import {
  createFormSession,
  nullSession,
  defaultFormConfig,
  Blueprint,
  type FormService,
} from '@gsa-tts/forms-core';

import { type FormManagerProps, type FormManagerContext } from './types.js';
import FormDelete from './FormDelete/FormDelete.js';
import FormEdit from './FormEdit/index.js';
import FormInspect from './FormInspect/FormInspect.js';
import FormList from './FormList/FormList.js';
import { FormManagerLayout } from './FormManagerLayout/FormManagerLayout.js';
import { NavPage } from './FormManagerLayout/TopNavigation.js';
import { FormPreview } from './FormPreview/FormPreview.js';
import * as AppRoutes from './routes.js';
import { FormManagerProvider } from './store.js';
import AvailableFormList from '../AvailableFormList/index.js';
import styles from './FormEdit/formEditStyles.module.css';

import {
  defaultPatternComponents,
  defaultPatternEditComponents,
} from '../index.js';

export default function FormManager(props: FormManagerProps) {
  // For now, hardcode the pattern React components.
  // If these are user-configurable, we'll likely need to, in some manner,
  // inject a compiled bundle into the application.
  const context: FormManagerContext = {
    ...props.context,
    components: defaultPatternComponents,
    config: defaultFormConfig,
    editComponents: defaultPatternEditComponents,
  };
  return (
    <HashRouter>
      <Routes>
        <Route
          path={AppRoutes.MyForms.path}
          Component={() => {
            return (
              <FormManagerProvider context={context} session={nullSession}>
                <FormManagerLayout>
                  <AvailableFormList
                    formService={context.formService}
                    urlForForm={context.urlForForm}
                    urlForFormManager={context.urlForFormManager}
                  />
                </FormManagerLayout>
              </FormManagerProvider>
            );
          }}
        />
        <Route
          path={AppRoutes.GuidedFormCreation.path}
          Component={() => {
            return (
              <FormManagerProvider context={context} session={nullSession}>
                <FormManagerLayout>
                  <FormList />
                </FormManagerLayout>
              </FormManagerProvider>
            );
          }}
        />
        <Route
          path={AppRoutes.Inspect.path}
          Component={() => {
            const { formId } = useParams();
            const form = useBlueprint(formId, context.formService);
            if (form === null) {
              return <div>Loading...</div>;
            }
            return (
              <FormManagerProvider
                context={context}
                formId={formId}
                session={createFormSession(form)}
              >
                <FormManagerLayout>
                  <FormInspect />
                </FormManagerLayout>
              </FormManagerProvider>
            );
          }}
        />
        <Route
          path={AppRoutes.Preview.path}
          Component={() => {
            const { formId } = useParams();
            const [searchParams] = useSearchParams();
            if (formId === undefined) {
              return <div>formId is undefined</div>;
            }
            const form = useBlueprint(formId, context.formService);
            if (form === null) {
              return <div>Loading...</div>;
            }
            return (
              <FormManagerProvider
                context={context}
                formId={formId}
                session={createFormSession(form, {
                  params: Object.fromEntries(searchParams),
                  url: AppRoutes.Preview.getUrl(formId),
                  options: { isFormBuilder: true },
                })}
              >
                <FormManagerLayout
                  step={NavPage.preview}
                  back={AppRoutes.Create.getUrl(formId)}
                  previewPath={AppRoutes.Preview.getUrl(formId)}
                  currentPath={AppRoutes.Preview.getUrl(formId)}
                >
                  <FormPreview />
                </FormManagerLayout>
              </FormManagerProvider>
            );
          }}
        />
        <Route
          path={AppRoutes.Create.path}
          Component={() => {
            const { formId } = useParams();
            const [searchParams] = useSearchParams();
            if (formId === undefined) {
              return <div>formId is undefined</div>;
            }
            const form = useBlueprint(formId, context.formService);
            if (form === null) {
              return <div>Loading...</div>;
            }
            return (
              <FormManagerProvider
                context={context}
                formId={formId}
                session={createFormSession(form, {
                  params: Object.fromEntries(searchParams),
                  url: AppRoutes.Create.getUrl(formId),
                  options: { isFormBuilder: true },
                })}
                savePeriodically={true}
              >
                <FormManagerLayout
                  step={NavPage.edit}
                  back={AppRoutes.GuidedFormCreation.getUrl()}
                  next={AppRoutes.Configure.getUrl(formId)}
                  previewPath={AppRoutes.Preview.getUrl(formId)}
                  currentPath={AppRoutes.Create.getUrl(formId)}
                >
                  <FormEdit />
                </FormManagerLayout>
              </FormManagerProvider>
            );
          }}
        />
        <Route
          path={AppRoutes.Configure.path}
          Component={() => {
            const { formId } = useParams();
            if (formId === undefined) {
              return <div>formId is undefined</div>;
            }
            const form = useBlueprint(formId, context.formService);
            if (form === null) {
              return <div>Loading...</div>;
            }
            return (
              <FormManagerProvider
                context={context}
                formId={formId}
                session={createFormSession(form)}
              >
                <FormManagerLayout
                  step={NavPage.settings}
                  back={AppRoutes.Create.getUrl(formId)}
                  next={AppRoutes.Publish.getUrl(formId)}
                  previewPath={AppRoutes.Preview.getUrl(formId)}
                  currentPath={AppRoutes.Configure.getUrl(formId)}
                >
                  <div className={`${styles.progressPage} grid-container`}>
                    <div className="grid-row">
                      <div className="grid-col-12">
                        <h1 className="font-body-3xl text-center bg-primary-darker padding-3 text-base-lightest">
                          <span>Coming Soon..</span>
                          <svg
                            className="usa-icon"
                            aria-hidden="true"
                            focusable="false"
                            role="img"
                          >
                            <use
                              xlinkHref={`${context.uswdsRoot}img/sprite.svg#construction_worker`}
                            ></use>
                          </svg>
                        </h1>
                        <h2 className="font-ui-xl">
                          Form Approval and Settings
                        </h2>
                        <h3 className="font-ui-lg">
                          <svg
                            className="usa-icon display-inline-block text-ttop margin-right-1 text-accent-warm"
                            aria-hidden="true"
                            focusable="false"
                            role="img"
                          >
                            <use
                              xlinkHref={`${context.uswdsRoot}img/sprite.svg#warning`}
                            ></use>
                          </svg>
                          <span className="display-inline-block text-ttop">
                            Work in Progress - Hello, DOJ Pardon Office!
                          </span>
                          <svg
                            className="usa-icon display-inline-block text-ttop margin-left-1 text-accent-warm"
                            aria-hidden="true"
                            focusable="false"
                            role="img"
                          >
                            <use
                              xlinkHref={`${context.uswdsRoot}img/sprite.svg#warning`}
                            ></use>
                          </svg>
                        </h3>
                        <p className="font-ui-md">
                          On this page, you can add additional settings to your
                          form, gather and review feedback by colleagues and
                          share the form for supervisor review.
                        </p>
                        <p className="font-ui-md">
                          Unprioritized Upcoming Feature List:
                        </p>
                        <ul className="usa-list font-ui-md">
                          <li>Commenting tools for colleagues</li>
                          <li>Commenting and review tools for supervisors</li>
                          <li>
                            Tracking form edit changes by multiple form builders
                          </li>
                          <li>Form branding tools</li>
                          <li>
                            Guided process to include additional forms in the
                            form application
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </FormManagerLayout>
              </FormManagerProvider>
            );
          }}
        />
        <Route
          path={AppRoutes.Publish.path}
          Component={() => {
            const { formId } = useParams();
            if (formId === undefined) {
              return <div>formId is undefined</div>;
            }
            const form = useBlueprint(formId, context.formService);
            if (form === null) {
              return <div>Loading...</div>;
            }
            const session = createFormSession(form);
            return (
              <FormManagerProvider
                context={context}
                formId={formId}
                session={session}
              >
                <FormManagerLayout
                  step={NavPage.publish}
                  back={AppRoutes.Configure.getUrl(formId)}
                  close={AppRoutes.MyForms.getUrl()}
                  previewPath={AppRoutes.Preview.getUrl(formId)}
                  currentPath={AppRoutes.Publish.getUrl(formId)}
                >
                  <div className={`${styles.progressPage} grid-container`}>
                    <div className="grid-row">
                      <div className="grid-col-12">
                        <h1 className="font-body-3xl text-center bg-primary-darker padding-3 text-base-lightest">
                          <span>Coming Soon..</span>
                          <svg
                            className="usa-icon"
                            aria-hidden="true"
                            focusable="false"
                            role="img"
                          >
                            <use
                              xlinkHref={`${context.uswdsRoot}img/sprite.svg#construction_worker`}
                            ></use>
                          </svg>
                        </h1>
                        <h2 className="font-ui-xl">Publish</h2>
                        <p className="font-ui-md">
                          On this page, you can review the pdf preview of your
                          created form and publish it. The exact contents of
                          this page are subject to change following additional
                          user research.
                        </p>
                        <p className="font-ui-md">
                          Unprioritized Upcoming Feature List:
                        </p>
                        <ul className="usa-list font-ui-md">
                          <li>A scrollable pdf view</li>
                          <li>A publish option for the page</li>
                        </ul>
                        <p>
                          <a
                            href={AppRoutes.Preview.getUrl(formId)}
                            className="usa-button usa-button--big margin-top-3"
                          >
                            Publish
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </FormManagerLayout>
              </FormManagerProvider>
            );
          }}
        />
        <Route
          path={AppRoutes.Delete.path}
          Component={() => {
            const { formId } = useParams();
            if (formId === undefined) {
              return <div>formId is undefined</div>;
            }
            return (
              <FormDelete formId={formId} formService={context.formService} />
            );
          }}
        />
      </Routes>
    </HashRouter>
  );
}

const useBlueprint = (formId: string | undefined, formService: FormService) => {
  if (formId === undefined) {
    console.error('formId is undefined');
    return null;
  }
  const [form, setForm] = useState<Blueprint | null>(null);
  useEffect(() => {
    formService.getForm(formId).then(result => {
      if (result.success) {
        setForm(result.data);
      } else {
        console.error('Error loading form', result.error);
      }
    });
  }, []);
  return form;
};
