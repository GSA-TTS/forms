import * as z from 'zod';

import { type Pattern, type PatternConfig } from '../../pattern.js';
import { type PackageDownloadProps } from '../../components.js';
import { getActionString } from '../../submission.js';
import { safeZodParseFormErrors } from '../../util/zod.js';

const configSchema = z.object({
  text: z.string().min(1),
});
export type PackageDownloadPattern = Pattern<z.infer<typeof configSchema>>;

export const packageDownloadConfig: PatternConfig<PackageDownloadPattern> = {
  displayName: 'Package download',
  iconPath: 'package-download-icon.svg',
  initial: {
    text: 'Description text...',
  },
  parseConfigData: obj => safeZodParseFormErrors(configSchema, obj),
  getChildren() {
    return [];
  },
  createPrompt(_, session, pattern, options) {
    return {
      props: {
        _patternId: pattern.id,
        type: 'package-download' as const,
        actions: [
          {
            type: 'submit',
            submitAction: getActionString({
              handlerId: 'package-download',
              patternId: pattern.id,
            }),
            text: 'Download PDF',
          },
        ],
        text: pattern.data.text,
      } as PackageDownloadProps,
      children: [],
    };
  },
};
