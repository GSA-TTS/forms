import React, { useState, useRef, useEffect } from 'react';
import { defaultFormConfig, type PatternConfig } from '@atj/forms';
import { useFormManagerStore } from '../store.js';
import styles from './formEditStyles.module.css';
import attachmentIcon from './images/page-icon.svg';
import blockIcon from './images/block-icon.svg';
import checkboxIcon from './images/checkbox-icon.svg';
import dateIcon from './images/date-icon.svg';
import dropDownIcon from './images/dropdown-icon.svg';
import dropDownOptionIcon from './images/dropdownoption-icon.svg';
import emailInputIcon from './images/email-icon.svg';
import genderId from './images/gender-id-icon.svg';
import longanswerIcon from './images/longanswer-icon.svg';
import pageIcon from './images/page-icon.svg';
import phoneIcon from './images/phone-icon.svg';
import richTextIcon from './images/richtext-icon.svg';
import shortanswerIcon from './images/shortanswer-icon.svg';
import ssnIcon from './images/ssn-icon.svg';
import singleselectIcon from './images/singleselect-icon.svg';
import templateIcon from './images/template-icon.svg';

import classNames from 'classnames';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const icons: Record<string, string | any> = {
  'attachment-icon.svg': attachmentIcon,
  'block-icon.svg': blockIcon,
  'checkbox-icon.svg': checkboxIcon,
  'date-icon.svg': dateIcon,
  'dropdown-icon.svg': dropDownIcon,
  'dropdownoption-icon.svg': dropDownOptionIcon,
  'email-icon.svg': emailInputIcon,
  'gender-id-icon.svg': genderId,
  'longanswer-icon.svg': longanswerIcon,
  'page-icon.svg': pageIcon,
  'phone-icon.svg': phoneIcon,
  'richtext-icon.svg': richTextIcon,
  'shortanswer-icon.svg': shortanswerIcon,
  'ssn-icon.svg': ssnIcon,
  'singleselect-icon.svg': singleselectIcon,
  'template-icon.svg': templateIcon,
};

const getIconPath = (iconPath: string) => {
  return Object.values(icons[iconPath])[0] as string;
};

interface PatternMenuProps {
  patternSelected: (patternType: string) => void;
  title: string;
}

export const AddPatternMenu = () => {
  const { addPage, addPattern } = useFormManagerStore(state => ({
    addPage: state.addPage,
    addPattern: state.addPattern,
  }));

  return (
    <fieldset
      className={`${styles.usaFieldset} usa-fieldset position-sticky z-100`}
    >
      <p className="tablet:display-block display-none usa-label margin-top-0 font-ui-3xs text-uppercase margin-bottom-3">
        Add Element
      </p>
      <div className="dropdownContainer margin-bottom-3">
        <ul className="usa-list usa-list--unstyled grid-row tablet:flex-justify-end flex-justify-center">
          <li className="position-relative tablet:grid-col-12 grid-col-5 text-center">
            <SidebarAddPatternMenuItem
              title="Question"
              patternSelected={addPattern}
            />
          </li>
          <li className="tablet:grid-col-12 grid-col-5 text-center">
            <MenuItemButton
              title="Page"
              onClick={addPage}
              iconPath="page-icon.svg"
            />
          </li>
        </ul>
      </div>
    </fieldset>
  );
};

const MenuItemButton = ({
  title,
  onClick,
  iconPath,
}: {
  title: string;
  onClick: () => void;
  iconPath: string;
}) => (
  <button
    className={`${styles.dropdownButton} tablet:width-full text-left width-auto text-base-darkest text-normal padding-0 bg-white border-0 cursor-pointer`}
    onClick={onClick}
  >
    <span className="tablet:display-inline-block tablet:width-auto tablet:margin-right-1 display-block width-full text-ttop text-center">
      <img
        className="usa-icon"
        src={getIconPath(iconPath)}
        alt=""
        width="24"
        height="24"
      />
    </span>
    <span className="display-inline-block text-ttop tablet:width-auto width-9 text-center">
      {title}
    </span>
  </button>
);

type DropdownPattern = [string, PatternConfig];
const sidebarPatterns: DropdownPattern[] = [
  ['checkbox', defaultFormConfig.patterns['checkbox']],
  ['date-of-birth', defaultFormConfig.patterns['date-of-birth']],
  ['email-input', defaultFormConfig.patterns['email-input']],
  ['fieldset', defaultFormConfig.patterns['fieldset']],
  ['form-summary', defaultFormConfig.patterns['form-summary']],
  ['gender-id', defaultFormConfig.patterns['gender-id']],
  ['input', defaultFormConfig.patterns['input']],
  ['package-download', defaultFormConfig.patterns['package-download']],
  ['paragraph', defaultFormConfig.patterns['paragraph']],
  ['phone-number', defaultFormConfig.patterns['phone-number']],
  ['radio-group', defaultFormConfig.patterns['radio-group']],
  ['rich-text', defaultFormConfig.patterns['rich-text']],
  ['select-dropdown', defaultFormConfig.patterns['select-dropdown']],
  ['date-of-birth', defaultFormConfig.patterns['date-of-birth']],
  ['attachment', defaultFormConfig.patterns['attachment']],
  [
    'social-security-number',
    defaultFormConfig.patterns['social-security-number'],
  ],
  ['repeater', defaultFormConfig.patterns['repeater']],
] as const;

export const compoundFieldChildPatterns: DropdownPattern[] = sidebarPatterns.filter(
  ([key]) => key !== 'fieldset' && key !== 'repeater'
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
            className="usa-icon"
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use xlinkHref={`${uswdsRoot}img/sprite.svg#add_circle`}></use>
          </svg>
        </span>
        <span className="display-inline-block text-ttop tablet:width-auto text-center">
          <span className="display-inline-block text-ttop margin-right-1 width-9">
            {title}
          </span>
          <img
            className="display-inline-block text-ttop"
            src={getIconPath('dropdown-icon.svg')}
            alt=""
            width="16"
            height="16"
          />
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
  return (
    <ul
      className={`${styles.dropdownMenu} usa-list usa-list--unstyled position-absolute bg-white z-100 shadow-3 text-left`}
    >
      {availablePatterns.map(([patternType, pattern], index) => (
        <li key={index} className={`${styles.dropdownItem} margin-left-1`}>
          <button
            className="bg-transparent padding-1 text-left width-full cursor-pointer border-0"
            onClick={() => {
              patternSelected(patternType);
            }}
          >
            <img
              className="display-inline-block text-ttop margin-right-1"
              src={(() => {
                return getIconPath(pattern.iconPath || 'block-icon.svg');
              })()}
              alt=""
              width="24"
              height="24"
            />
            <span className="display-inline-block text-ttop">
              {pattern.displayName}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};
