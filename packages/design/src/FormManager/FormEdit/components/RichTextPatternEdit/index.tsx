import classNames from 'classnames';
import React, { useState } from 'react';
import debounce from 'debounce';
import { EditorContent, useEditor } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

import { enLocale as message } from '@atj/common';
import {
  type PatternId,
  type PatternMap,
  type RichTextPattern,
  type RichTextProps,
} from '@atj/forms';

import RichText from '../../../../Form/components/RichText/index.js';
import { PatternEditActions } from '../common/PatternEditActions.js';
import { PatternEditForm } from '../common/PatternEditForm.js';
import { usePatternEditFormContext } from '../common/hooks.js';
import { useFormManagerStore } from '../../../store.js';

import { PatternEditComponent } from '../../types.js';
import styles from './richTextPatternEditStyles.module.css';

import boldSvg from './images/format_bold.svg';
import italicSvg from './images/format_italic.svg';
import bulletListSvg from './images/format_list_bulleted.svg';
import orderedListSvg from './images/format_list_numbered.svg';
import headingSvg from './images/format_h2.svg';
import subheadingSvg from './images/format_h3.svg';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const icons: Record<string, string | any> = {
  'format_h2.svg': headingSvg,
  'format_h3.svg': subheadingSvg,
  'format_bold.svg': boldSvg,
  'format_italic.svg': italicSvg,
  'format_list_bulleted.svg': bulletListSvg,
  'format_list_numbered.svg': orderedListSvg,
};

const getIconPath = (iconPath: string) => {
  return Object.values(icons[iconPath])[0] as string;
};

interface MenuBarProps {
  editor: Editor | null;
}

type RichTextFormData = PatternMap & {
  [p: string]: {
    text: string;
  };
};

interface EditorActions {
  label: string;
  icon: string;
  property: string;
  action: () => void;
  disabled: boolean;
  parameter?: Record<string, unknown>;
}

const RichTextPatternEdit: PatternEditComponent<RichTextProps> = ({
  context,
  focus,
  previewProps,
}) => {
  return (
    <>
      {focus ? (
        <PatternEditForm
          pattern={focus.pattern}
          editComponent={<EditComponent patternId={focus.pattern.id} />}
        ></PatternEditForm>
      ) : (
        <div className="padding-left-3 padding-bottom-3 padding-right-3">
          <p>{message.patterns.richText.displayName}</p>
          <RichText context={context} {...previewProps} />
        </div>
      )}
    </>
  );
};

export default RichTextPatternEdit;

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const editorActions: Array<EditorActions> = [
    {
      label: 'Heading',
      icon: getIconPath('format_h2.svg'),
      property: 'heading',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      disabled: false,
      parameter: { level: 2 },
    },
    {
      label: 'Subheading',
      icon: getIconPath('format_h3.svg'),
      property: 'heading',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      disabled: false,
      parameter: { level: 3 },
    },
    {
      label: 'Bold',
      icon: getIconPath('format_bold.svg'),
      property: 'bold',
      action: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      icon: getIconPath('format_italic.svg'),
      property: 'italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      label: 'Bullet list',
      icon: getIconPath('format_list_bulleted.svg'),
      property: 'bulletList',
      action: () => editor.chain().focus().toggleBulletList().run(),
      disabled: false,
    },
    {
      label: 'Ordered list',
      icon: getIconPath('format_list_numbered.svg'),
      property: 'orderedList',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      disabled: false,
    },
  ];

  return (
    <div className="bg-base-lightest padding-x-2 padding-y-1 border-bottom-1px border-base-light">
      <ul className={`usa-button-group ${styles.richTextMenuBar}`}>
        {editorActions.map(
          ({ label, icon, action, parameter, property, disabled }, index) => (
            <li className="usa-button-group__item" key={index}>
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  return action();
                }}
                className={classNames(
                  'usa-button',
                  `${styles.richTextMenuBarButton}`,
                  {
                    'usa-button--outline': !editor.isActive(
                      property,
                      parameter
                    ),
                  }
                )}
                disabled={disabled}
              >
                <img
                  className={classNames({
                    [styles.richTextMenuBarButtonSelected]: !editor.isActive(
                      property,
                      parameter
                    ),
                  })}
                  style={
                    !editor.isActive(property, parameter)
                      ? { filter: 'invert(0) brightness(1)' }
                      : { filter: 'invert(1) brightness(2)' }
                  }
                  role="img"
                  src={icon}
                  alt={label}
                />
              </button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

const EditComponent = ({ patternId }: { patternId: PatternId }) => {
  const pattern = useFormManagerStore<RichTextPattern>(
    state => state.session.form.patterns[patternId]
  );
  const { fieldId, getFieldState, register, setValue } =
    usePatternEditFormContext<RichTextPattern>(patternId);
  const text = getFieldState('text');
  const { updateActivePattern } = useFormManagerStore(state => ({
    updateActivePattern: state.updateActivePattern,
  }));

  const [editorContent, setEditorContent] = useState(pattern.data.text);
  const debouncedUpdate = debounce(updateActivePattern, 200);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    autofocus: true,
    content: editorContent,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setEditorContent(content);
      setValue('text', content);
      const data: RichTextFormData = {
        [patternId]: {
          ...pattern,
          text: content,
        },
      };
      debouncedUpdate(data);
    },
  });

  return (
    <div className="grid-row grid-gap-1">
      <div className="tablet:grid-col-12">
        <p
          className={classNames('usa-label', {
            'usa-label--error': text.error,
          })}
        >
          {text.error ? (
            <span className="usa-error-message" role="alert">
              {text.error.message}
            </span>
          ) : null}
        </p>
        <div
          className={`${styles.richTextEditorWrapper} border-1px border-base-light`}
        >
          <MenuBar editor={editor} />
          <EditorContent
            editor={editor}
            className={`padding-2 ${styles.richTextEditorBody}`}
            aria-label="Edit and format this text"
            spellCheck="false"
            role="textbox"
          />
        </div>
        <input
          id={fieldId('text')}
          {...register('text', {
            required: false,
          })}
          defaultValue={pattern.data.text}
          type="hidden"
        ></input>
      </div>
      <PatternEditActions />
    </div>
  );
};
