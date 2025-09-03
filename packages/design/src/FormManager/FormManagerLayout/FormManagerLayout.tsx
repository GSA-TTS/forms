import React from 'react';

import { Notifications } from '../Notifications/index.js';
import { type NavPage, TopNavigation } from './TopNavigation.js';
import { BottomNavigation } from './BottomNavigation.js';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useFormManagerStore } from '../store.js';
import styles from './formManagerStyles.module.css';

type FormManagerLayoutProps = {
  children?: React.ReactNode;
  step?: NavPage;
  back?: string;
  close?: string;
  next?: string;
  previewPath?: string;
  currentPath?: string;
};

export const FormManagerLayout = ({
  children,
  step,
  back,
  close,
  next,
  previewPath,
  currentPath,
}: FormManagerLayoutProps) => {
  const location = useLocation();
  const { addNotification } = useFormManagerStore();

  useEffect(() => {
    if (location?.state?.result?.success) {
      addNotification('success', 'Form import was successful.');
    }
  }, []);

  return (
    <>
      <Notifications />
      {step && (
        <TopNavigation
          curPage={step}
          previewPath={previewPath}
          currentPath={currentPath}
          back={back}
        />
      )}
      <section className={`${styles.editPage} position-relative`}>
        <div className="grid-row flex-justify-center">
          <div className="grid-col-12">
            <div className="bg-white">{children}</div>
          </div>
        </div>
      </section>
      {step && <BottomNavigation back={back} next={next} close={close} />}
    </>
  );
};
