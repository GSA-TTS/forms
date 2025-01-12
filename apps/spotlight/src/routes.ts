import { getAppContext } from './context.js';

export const getFormUrl = (formId: string) => {
  const context = getAppContext();
  return `${context.baseUrl}forms/#/${formId}`;
};

export const getFormManagerUrlById = (formId: string) => {
  const context = getAppContext();
  return `${context.baseUrl}#/${formId}`;
};

export const getManageUrl = () => {
  const context = getAppContext();
  return `${context.baseUrl}manage/`;
};

export const getHomeUrl = () => {
  const context = getAppContext();
  return context.baseUrl;
};

export const getStorybookUrl = () => {
  const context = getAppContext();
  return `${context.baseUrl}design/index.html`;
};

export const getPublicDirUrl = () => {
  const context = getAppContext();
  return context.baseUrl;
};

export const getAboutUrl = () => {
  const context = getAppContext();
  return `${context.baseUrl}about/index.html`;
};
