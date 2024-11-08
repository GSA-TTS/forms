import deepEqual from 'deep-equal';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  applyPromptResponse,
  createPrompt,
  type FormConfig,
  type FormRoute,
  type FormSession,
  type PatternProps,
  type Prompt,
  type PromptComponent,
} from '@atj/forms';

export type FormUIContext = {
  config: FormConfig;
  components: ComponentForPattern;
  uswdsRoot: `${string}/`;
};

export type ComponentForPattern<T extends PatternProps = PatternProps> = Record<
  string,
  PatternComponent<T>
>;

export type PatternComponent<T extends PatternProps = PatternProps<unknown>> =
  React.ComponentType<
    T & {
      children?: React.ReactNode;
    }
  >;

const usePrompt = (
  initialPrompt: Prompt,
  config: FormConfig,
  session: FormSession
) => {
  const [prompt, _setPrompt] = useState<Prompt>(initialPrompt);
  const setPrompt = (newPrompt: Prompt) => {
    if (!deepEqual(newPrompt, prompt)) {
      _setPrompt(newPrompt);
    }
  };
  const updatePrompt = (data: Record<string, string>) => {
    const result = applyPromptResponse(config, session, {
      action: 'submit',
      data,
    });
    if (!result.success) {
      console.warn('Error applying prompt response...', result.error);
      return;
    }
    const prompt = createPrompt(config, result.data, { validate: true });
    setPrompt(prompt);
  };
  return { prompt, setPrompt, updatePrompt };
};

const getRouteUrl = (route?: FormRoute) => {
  if (!route) {
    return '';
  } else {
    const queryString = new URLSearchParams(
      route.params as Record<string, string>
    ).toString();
    return `${route.url}?${queryString}`;
  }
};

export default function Form({
  context,
  session,
  onSubmit,
  isPreview, // ideally this should be removed. just here now for the FFP demo
}: {
  context: FormUIContext;
  session: FormSession;
  onSubmit?: (data: Record<string, string>) => void;
  isPreview?: boolean;
}) {
  const initialPrompt = createPrompt(context.config, session, {
    validate: false,
  });
  const { prompt, setPrompt, updatePrompt } = usePrompt(
    initialPrompt,
    context.config,
    session
  );

  // So the preview view can update the session, regen the prompt.
  // This feels smelly.
  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const formMethods = useForm<Record<string, string>>({});

  return (
    <FormProvider {...formMethods}>
      <div className="preview grid-container">
        <div className="grid-row">
          <div className="grid-col-12 usa-prose">
            {!isPreview ? (
              <form
                className="usa-form margin-bottom-3 maxw-full"
                onSubmit={
                  onSubmit
                    ? formMethods.handleSubmit(async (data, event) => {
                        const submitEvent = event?.nativeEvent as
                          | SubmitEvent
                          | undefined;
                        if (submitEvent === undefined) {
                          console.error(
                            "Can't handle submission without event"
                          );
                          return;
                        }
                        const action = (
                          submitEvent.submitter as HTMLButtonElement
                        )?.value;
                        updatePrompt(data);
                        console.log('Submitting form...');
                        onSubmit({ ...data, action });
                      })
                    : undefined
                }
                method="POST"
                action={getRouteUrl(session.route)}
                aria-label={session.form.summary.title || 'Form'}
              >
                <FormContents context={context} prompt={prompt} />
              </form>
            ) : (
              <div className="formContentWrapper">
                <FormContents context={context} prompt={prompt} />
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

const FormContents = ({
  context,
  prompt,
}: {
  context: FormUIContext;
  prompt: Prompt;
}) => {
  return (
    <>
      <fieldset className="usa-fieldset width-full">
        {prompt.components.map((component, index) => {
          return (
            <PromptComponent
              key={index}
              context={context}
              component={component}
            />
          );
        })}
      </fieldset>
    </>
  );
};

const PromptComponent = ({
  context,
  component,
}: {
  context: FormUIContext;
  component: PromptComponent;
}) => {
  const Component = context.components[component.props.type];
  return (
    <Component {...component.props}>
      {component.children?.map((childPromptComponent, index) => {
        return (
          <PromptComponent
            key={index}
            context={context}
            component={childPromptComponent}
          />
        );
      })}
    </Component>
  );
};
