import React from 'react';
import { useFormManagerStore } from '../store.js';

const FormInspect = () => {
  const form = useFormManagerStore(state => state.session.form);
  return (
    <pre>
      <code>{JSON.stringify(form, null, 2)}</code>
    </pre>
  );
};

export default FormInspect;
