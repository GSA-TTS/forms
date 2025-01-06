import qs from 'qs';
import { PatternId } from './pattern.js';

export type RouteData = qs.ParsedQs;
export type FormRoute = {
  url: string;
  params: RouteData;
  options?: {
    isFormBuilder?: boolean;
  };
};

export const getRouteDataFromQueryString = (queryString: string): RouteData => {
  return qs.parse(queryString, { allowDots: true });
};

export const getPatternRouteData = (
  routeData: RouteData,
  patternId: PatternId
) => {
  return routeData[patternId] || {};
};
