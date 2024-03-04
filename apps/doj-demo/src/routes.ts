import { getAppContext } from './context';

export const getFormUrl = (formId: string) => {
  const context = getAppContext();
  return `${context.baseUrl}forms/#${formId}`;
};

export const getManageUrl = () => {
  const context = getAppContext();
  return `${context.baseUrl}manage/`;
};

export const getHomeUrl = () => {
  const context = getAppContext();
  return context.baseUrl;
};

export const getFaviconUrl = () => {
  const context = getAppContext();
  return `${context.baseUrl}favicon.ico`;
};
