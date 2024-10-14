import React, { useState, useRef, useEffect } from 'react';
import { useFormManagerStore } from '../../../store.js';
import styles from '../../formEditStyles.module.css';
import type { Pattern } from '@atj/forms';

interface MovePatternDropdownProps {
  isCompound: boolean;
}

// Define the extended type for pages
interface PageWithLabel {
  id: string;
  type: string;
  data: {
    title: string;
    patterns: string[];
  };
  specialLabel?: string;
}

const MovePatternDropdown: React.FC<MovePatternDropdownProps> = ({
  isCompound,
}) => {
  const context = useFormManagerStore(state => state.context);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [targetPage, setTargetPage] = useState('');
  const [moveToPosition, setMoveToPosition] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pages = useFormManagerStore(state =>
    Object.values<Pattern>(state.session.form.patterns).filter(
      p => p.type === 'page'
    )
  );
  const movePatternToPage = useFormManagerStore(state => state.movePattern);
  const focusPatternId = useFormManagerStore(state => state.focus?.pattern.id);
  const useAvailablePages = () => {
    const currentPageIndex = pages.findIndex(page =>
      page.data.patterns.includes(focusPatternId || '')
    );
    const page1Count = pages.reduce(
      (count, page) => count + (page.data.title === 'Page 1' ? 1 : 0),
      0
    );
    const availablePages: PageWithLabel[] =
      page1Count > 1
        ? pages.slice(1).map((page, index) => {
            if (index + 1 === currentPageIndex) {
              return { ...page, specialLabel: 'Current page' };
            }
            return page;
          })
        : pages.map((page, index) => {
            if (index === currentPageIndex) {
              return { ...page, specialLabel: 'Current page' };
            }
            return page;
          });

    return availablePages;
  };
  const availablePages = useAvailablePages();
  const currentPageIndex = pages.findIndex(page =>
    page.data.patterns.includes(focusPatternId || '')
  );
  const sourcePage = pages[currentPageIndex]?.id;
  const handleMovePattern = () => {
    if (focusPatternId && targetPage) {
      movePatternToPage(sourcePage, targetPage, focusPatternId, moveToPosition);
    }
    setDropdownOpen(false);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDropdownOpen(false);
      buttonRef.current?.focus();
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      dropdownRef.current?.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      dropdownRef.current?.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      dropdownRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  return (
    <div
      className={`${styles.moveToPageWrapper} display-inline-block text-ttop position-relative`}
      ref={dropdownRef}
    >
      <p
        className={`${styles.movePatternButton} margin-top-1 display-inline-block text-ttop cursor-pointer`}
      >
        <button
          className="usa-button--outline usa-button--unstyled margin-right-0  padding-top-1 padding-left-05 padding-bottom-05"
          type="button"
          ref={buttonRef}
          aria-haspopup="true"
          aria-expanded={dropdownOpen ? 'true' : 'false'}
          onClick={event => {
            event.preventDefault();
            toggleDropdown();
          }}
        >
          <span className="display-inline-block text-ttop">
            {isCompound ? 'Move questions' : 'Move question'}
          </span>
          <svg
            className="usa-icon display-inline-block text-ttop"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use
              xlinkHref={`${context.uswdsRoot}img/sprite.svg#expand_more`}
            ></use>
          </svg>
        </button>
      </p>
      {dropdownOpen && (
        <div className={`${styles.dropDown} padding-2`} tabIndex={-1}>
          <div className={`${styles.moveToPagePosition} margin-bottom-1`}>
            <label
              className="usa-label display-inline-block text-ttop margin-right-1"
              htmlFor="pagenumbers"
            >
              Page:
            </label>
            <select
              className="usa-select display-inline-block text-ttop"
              name="pagenumbers"
              id="pagenumbers"
              value={targetPage}
              onChange={e => setTargetPage(e.target.value)}
            >
              <option value="" disabled>
                Select page
              </option>
              {availablePages.map((page, index) => (
                <option key={page.id} value={page.id}>
                  {page.specialLabel || page.data.title || `Page ${index + 2}`}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.moveToPagePosition} margin-bottom-1`}>
            <label
              className="usa-label margin-right-1 display-inline-block text-ttop"
              htmlFor="elementPosition"
            >
              Position:
            </label>
            <select
              className="usa-select display-inline-block text-ttop"
              name="elementPosition"
              id="elementPosition"
              value={moveToPosition}
              onChange={e =>
                setMoveToPosition(e.target.value as 'top' | 'bottom')
              }
            >
              <option value="" disabled>
                Select position
              </option>
              <option value="top">Top of page</option>
              <option value="bottom">Bottom of page</option>
            </select>
          </div>
          <p>
            <button
              type="button"
              aria-label={
                isCompound
                  ? 'Move these questions to another page'
                  : 'Move question to another page'
              }
              title={
                isCompound
                  ? 'Move these questions to another page'
                  : 'Move question to another page'
              }
              className="usa-button margin-right-0"
              onClick={handleMovePattern}
            >
              {isCompound ? 'Move fieldset' : 'Move question'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default MovePatternDropdown;
