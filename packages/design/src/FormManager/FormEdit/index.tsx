import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Form from '../../Form/Form.js';
import { type ComponentForPattern } from '../../Form/types.js';

import { AddPatternMenu } from './AddPatternDropdown.js';
import { PreviewPattern } from './PreviewPattern.js';
import { useFormManagerStore } from '../store.js';

const EditForm = () => {
  const session = useFormManagerStore(state => state.session);
  const { context, setRouteParams } = useFormManagerStore(state => ({
    context: state.context,
    setRouteParams: state.setRouteParams,
  }));
  const location = useLocation();

  // Update the state's routeParams on react-router-dom's update.
  useEffect(() => {
    const routeParams = location.search.startsWith('?')
      ? location.search.substring(1)
      : location.search;
    setRouteParams(routeParams);
  }, [location]);

  return (
    <div className="grid-container">
      <div className="grid-row position-relative">
        <div className="desktop:grid-col-2 tablet:grid-col-3 tablet:display-block grid-col-12 display-none padding-y-3 padding-right-3">
          <AddPatternMenu />
        </div>
        <div className="desktop:grid-col-10 tablet:grid-col-9 grid-col-12 tablet:border-left tablet:border-bottom tablet:border-right tablet:border-left-2px tablet:border-base-lighter bg-primary-lighter contentWrapper">
          <div className="grid-col-12">
            <Form
              isPreview={true}
              context={{
                config: context.config,
                // TODO: We might want to hoist this definition up to a higher level,
                // so we don't have to regenerate it every time we render the form.
                components: createPreviewComponents(context.components),
                uswdsRoot: context.uswdsRoot,
              }}
              session={session}
            ></Form>
          </div>
        </div>
        <div className="tablet:display-none grid-col-12 padding-y-3">
          <AddPatternMenu />
        </div>
      </div>
    </div>
  );
};

export default EditForm;

const createPreviewComponents = (
  components: ComponentForPattern
): ComponentForPattern => {
  const previewComponents: ComponentForPattern = {};
  for (const patternType of Object.keys(components)) {
    previewComponents[patternType] = PreviewPattern;
  }
  return previewComponents;
};
