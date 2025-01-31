import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Blueprint, FormService } from '@gsa-tts/forms-core';

export default function FormDelete({
  formId,
  formService,
}: {
  formId: string;
  formService: FormService;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState<Blueprint | null>(null);
  useEffect(() => {
    formService.getForm(formId).then(result => {
      if (!result.success) {
        navigate('/');
      } else {
        setForm(result.data);
      }
    });
  }, []);
  const deleteForm = () => {
    formService.deleteForm(formId);
    navigate('/');
  };
  return (
    <div className="deleteFormPage grid-container">
      <h1>Delete form</h1>
      <h2>
        Are you sure you want to delete the form:{' '}
        <span className="text-italic">{form?.summary.title}</span>?
      </h2>
      <p className="padding-bottom-3">
        <button className="usa-button" onClick={deleteForm}>
          Delete form
        </button>
      </p>
      <details>
        <pre>
          <code>{JSON.stringify(form, null, 4)}</code>
        </pre>
      </details>
    </div>
  );
}
