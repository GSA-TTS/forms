import classNames from 'classnames';
import React from 'react';
import styles from './pageMenuStyles.module.css';

export type PageMenuProps = {
  pages: {
    selected: boolean;
    title: string;
    url: string;
    visited: boolean;
  }[];
};

export const PageMenu = ({ pages }: PageMenuProps) => {
  const [updatedPages, setUpdatedPages] = React.useState(pages);

  const handlePageVisit = (index: number) => {
    setUpdatedPages(prevPages =>
      prevPages.map((page, i) =>
        i === index || page.selected ? { ...page, visited: true } : page
      )
    );
  };

  React.useEffect(() => {
    const selectedIndex = pages.findIndex(page => page.selected);
    if (selectedIndex !== -1) {
      handlePageVisit(selectedIndex);
    }
  }, [pages]);

  return (
    <div className={`${styles.sideNavWrapper} position-sticky`}>
      <ul className={`${styles.sideNav} usa-sidenav`}>
        {updatedPages.map((page, index) => (
          <li
            key={index}
            className={classNames('usa-sidenav__item', styles.sideNav, {
              'usa-current text-primary': page.selected,
            })}
            onClick={() => handlePageVisit(index)}
          >
            <a
              className={`${styles.usaNavLink} ${page.visited ? styles.visited : ''}`}
              href={page.url}
            >
              {page.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
