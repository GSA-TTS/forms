export * from './document.js';
export * from './pdf/index.js';
export * from './types.js';

export const SAMPLE_DOCUMENTS = [
  {
    path: 'sample-documents/ca-unlawful-detainer/ud105.pdf',
    title: 'California UD-105 (unlawful detainer)',
  },
  {
    path: 'sample-documents/alabama-name-change/ps-12.pdf',
    title: 'Alabama PS-12 (name change)',
  },
  {
    path: 'sample-documents/doj-pardon-marijuana/demo-application_for_certificate_of_pardon_for_simple_marijuana_possession.pdf',
    title: 'DOJ Marijuana Pardon Application',
  },
] as const;
