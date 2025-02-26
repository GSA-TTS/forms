import React, { useState, useRef, useEffect } from 'react';
import { defaultFormConfig, type PatternConfig } from '@gsa-tts/forms-core';
import { useFormManagerStore } from '../store.js';
import styles from './formEditStyles.module.css';
import blockIcon from './images/block-icon.svg';
import checkboxIcon from './images/checkbox-icon.svg';
import longAnswerIcon from './images/long-answer-icon.svg';
import pageIcon from './images/page-icon.svg';
import shortAnswerIcon from './images/short-answer-icon.svg';
import multipleChoiceIcon from './images/radio-options-icon.svg';
import templateIcon from './images/template-icon.svg';

import classNames from 'classnames';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const icons: Record<string, string | any> = {
  'attachment-icon.svg': 'img/sprite.svg#attach_file',
  'block-icon.svg': blockIcon,
  'checkbox-icon.svg': checkboxIcon,
  'date-icon.svg': 'img/sprite.svg#calendar_today',
  'dropdown-icon.svg': 'img/sprite.svg#expand_more',
  'dropdownoption-icon.svg': 'img/sprite.svg#expand_more',
  'email-icon.svg': 'img/sprite.svg#alternate_email',
  'gender-id-icon.svg': 'img/sprite.svg#person',
  'long-answer-icon.svg': longAnswerIcon,
  'list-icon.svg': 'img/sprite.svg#list',
  'page-icon.svg': pageIcon,
  'phone-icon.svg': 'img/sprite.svg#phone',
  'richtext-icon.svg': 'img/sprite.svg#text_fields',
  'short-answer-icon.svg': shortAnswerIcon,
  'ssn-icon.svg': 'img/sprite.svg#person',
  'radio-options-icon.svg': multipleChoiceIcon,
  'template-icon.svg': templateIcon,
};

const getIconPath = (iconPath: string): string => {
  const { uswdsRoot } = useFormManagerStore(state => ({
    uswdsRoot: state.context.uswdsRoot,
  }));

  const iconValue = icons[iconPath];

  if (!iconValue) {
    return '';
  }

  return typeof iconValue === 'string'
    ? `${uswdsRoot}${iconValue}`
    : (Object.values(iconValue)[0] as string);
};

interface PatternMenuProps {
  patternSelected: (patternType: string) => void;
  title: string;
}

export const AddPatternMenu = () => {
  const { addPattern } = useFormManagerStore(state => ({
    addPage: state.addPage,
    addPattern: state.addPattern,
  }));

  return (
    <fieldset
      className={`${styles.usaFieldset} usa-fieldset position-sticky z-100`}
    >
      <div className="dropdownContainer margin-bottom-3">
        <ul className="usa-list usa-list--unstyled grid-row tablet:flex-justify-end flex-justify-center">
          <li className="position-relative tablet:grid-col-12 grid-col-5 text-center">
            <SidebarAddPatternMenuItem
              title="Add element"
              patternSelected={addPattern}
            />
          </li>
        </ul>
      </div>
    </fieldset>
  );
};

type DropdownPattern = [string, PatternConfig, string];
const sidebarPatterns: DropdownPattern[] = [
  ['radio-group', defaultFormConfig.patterns['radio-group'], 'Choice'],
  ['checkbox', defaultFormConfig.patterns['checkbox'], 'Choice'],
  ['select-dropdown', defaultFormConfig.patterns['select-dropdown'], 'Choice'],
  ['input', defaultFormConfig.patterns['input'], 'Freeform answer'],
  ['text-area', defaultFormConfig.patterns['text-area'], 'Freeform answer'],
  ['paragraph', defaultFormConfig.patterns['paragraph'], 'Freeform answer'],
  [
    'email-input',
    defaultFormConfig.patterns['email-input'],
    'Personal information',
  ],
  [
    'phone-number',
    defaultFormConfig.patterns['phone-number'],
    'Personal information',
  ],
  [
    'date-of-birth',
    defaultFormConfig.patterns['date-of-birth'],
    'Personal information',
  ],
  [
    'social-security-number',
    defaultFormConfig.patterns['social-security-number'],
    'Personal information',
  ],
  [
    'gender-id',
    defaultFormConfig.patterns['gender-id'],
    'Personal information',
  ],
  ['fieldset', defaultFormConfig.patterns['fieldset'], 'Form structure'],
  ['repeater', defaultFormConfig.patterns['repeater'], 'Form structure'],
  ['page', defaultFormConfig.patterns['page'], 'Form structure'],
  [
    'form-summary',
    defaultFormConfig.patterns['form-summary'],
    'Form structure',
  ],
  ['rich-text', defaultFormConfig.patterns['rich-text'], 'Other'],
  ['attachment', defaultFormConfig.patterns['attachment'], 'Other'],
  ['package-download', defaultFormConfig.patterns['package-download'], 'Other'],
] as const;

export const compoundFieldChildPatterns: DropdownPattern[] =
  sidebarPatterns.filter(
    ([key]) =>
      key !== 'fieldset' &&
      key !== 'repeater' &&
      key !== 'page' &&
      key !== 'form-summary'
  );

export const SidebarAddPatternMenuItem = ({
  patternSelected,
  title,
}: PatternMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { uswdsRoot } = useFormManagerStore(state => ({
    uswdsRoot: state.context.uswdsRoot,
  }));

  return (
    <AddPatternDropdown
      availablePatterns={sidebarPatterns}
      closeDropdown={() => setIsOpen(false)}
      isOpen={isOpen}
      patternSelected={patternSelected}
    >
      <button
        className={`${styles.dropdownButton} tablet:width-full text-left width-auto text-base-darkest text-normal padding-0 bg-white border-0 cursor-pointer margin-bottom-3`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="tablet:display-inline-block tablet:width-auto tablet:margin-right-1 display-block width-full text-ttop text-center">
          <svg
            className="usa-icon--size-3"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use xlinkHref={`${uswdsRoot}img/sprite.svg#add_circle`}></use>
          </svg>
        </span>
        <span className="display-inline-block text-ttop tablet:width-auto text-center">
          <span className="display-inline-block text-ttop margin-right-1">
            {title}
          </span>
          <svg
            className="usa-icon"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use xlinkHref={`${uswdsRoot}img/sprite.svg#arrow_drop_down`}></use>
          </svg>
        </span>
      </button>
    </AddPatternDropdown>
  );
};

export const CompoundAddPatternButton = ({
  patternSelected,
  title,
}: PatternMenuProps) => {
  const { uswdsRoot } = useFormManagerStore(state => ({
    uswdsRoot: state.context.uswdsRoot,
  }));
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={classNames(styles.dottedLine, 'margin-top-2 cursor-default')}
    >
      <AddPatternDropdown
        availablePatterns={compoundFieldChildPatterns}
        closeDropdown={() => setIsOpen(false)}
        isOpen={isOpen}
        patternSelected={patternSelected}
      >
        <button
          className={classNames(
            'bg-white text-base padding-0 border-0 cursor-pointer'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="usa-icon text-base"
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use xlinkHref={`${uswdsRoot}img/sprite.svg#add_circle`}></use>
          </svg>{' '}
          <span className="display-inline-block text-ttop tablet:width-auto text-center">
            <span className="display-inline-block text-ttop margin-right-1">
              {title}
            </span>
          </span>
        </button>
      </AddPatternDropdown>
    </div>
  );
};

export const CompoundAddNewPatternButton = ({
  patternSelected,
  title,
}: PatternMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AddPatternDropdown
      availablePatterns={compoundFieldChildPatterns}
      closeDropdown={() => setIsOpen(false)}
      isOpen={isOpen}
      patternSelected={patternSelected}
    >
      <button
        className="usa-button usa-button--unstyled"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
      </button>
    </AddPatternDropdown>
  );
};

export const AddPatternDropdown = ({
  children,
  availablePatterns,
  closeDropdown,
  isOpen,
  patternSelected,
}: React.PropsWithChildren<{
  availablePatterns: DropdownPattern[];
  closeDropdown: () => void;
  isOpen: boolean;
  patternSelected: (patternType: string) => void;
}>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      {children}
      {isOpen && (
        <AddPatternDropdownContent
          availablePatterns={availablePatterns}
          patternSelected={(patternType: string) => {
            closeDropdown();
            patternSelected(patternType);
          }}
        />
      )}
    </div>
  );
};

const AddPatternDropdownContent = ({
  availablePatterns,
  patternSelected,
}: {
  availablePatterns: DropdownPattern[];
  patternSelected: (patternType: string) => void;
}) => {
  const { addPage } = useFormManagerStore(state => ({
    addPage: state.addPage,
  }));

  // Group patterns by category
  const patternsByCategory = availablePatterns.reduce(
    (acc, [patternType, pattern, patternCategory]) => {
      if (!acc[patternCategory]) {
        acc[patternCategory] = [];
      }
      acc[patternCategory].push([patternType, pattern]);
      return acc;
    },
    {} as Record<string, [string, PatternConfig][]>
  );

  return (
    <div className={styles.addPatternDropdown}>
      <ul
        className={`${styles.dropdownMenu} usa-list usa-list--unstyled position-absolute bg-white z-100 shadow-3 text-left`}
      >
        {Object.entries(patternsByCategory).map(
          ([category, patterns], categoryIndex) => (
            <React.Fragment key={category}>
              {categoryIndex > 0 && (
                <div className={styles.categoryDivider}></div>
              )}
              <li className="category-item">
                <strong className="category-title margin-left-1">
                  {category}
                </strong>
                <ul className={styles.categoryList}>
                  {patterns.map(([patternType, pattern], index) => {
                    const iconPath = getIconPath(
                      pattern.iconPath ?? 'block-icon.svg'
                    );
                    const pagePattern = patternType === 'page';
                    return (
                      <li key={index} className={styles.dropdownItem}>
                        <button
                          className="display-flex flex-align-center bg-transparent padding-1 text-left width-full cursor-pointer border-0"
                          onClick={() => {
                            if (pagePattern) {
                              addPage();
                            } else {
                              patternSelected(patternType);
                            }
                          }}
                        >
                          {iconPath.includes('img/sprite.svg') ? (
                            <>
                              <span className="display-inline-block margin-right-1">
                                <svg
                                  className="usa-icon--size-3"
                                  aria-hidden="true"
                                  focusable="false"
                                  role="img"
                                >
                                  <use xlinkHref={iconPath}></use>
                                </svg>
                              </span>
                              <span className="display-inline-block">
                                {pattern.displayName}
                              </span>
                            </>
                          ) : (
                            <>
                              <img
                                className="display-inline-block margin-right-1"
                                src={iconPath}
                                alt=""
                                width="30"
                                height="30"
                              />
                              <span className="display-inline-block">
                                {pattern.displayName}
                              </span>
                            </>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </React.Fragment>
          )
        )}
      </ul>
    </div>
  );
};
