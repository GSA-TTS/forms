import * as z from 'zod';

import { type Result, failure, success } from '@atj/common';

import {
  type FormConfig,
  type Pattern,
  type PatternId,
  getPattern,
} from './pattern';
import { type FormSession } from './session';
import { type Blueprint } from '.';

export type SubmitHandler<P extends Pattern = Pattern> = (
  config: FormConfig,
  opts: {
    pattern: P;
    session: FormSession;
    data: Record<string, string>;
  }
) => Promise<
  Result<{
    session: FormSession;
    attachments?: {
      fileName: string;
      data: Uint8Array;
    }[];
  }>
>;

const actionRegEx = /^action\/([a-z0-9-]+)\/([a-z0-9-]+)$/;
const actionSchema = z
  .string()
  .regex(actionRegEx)
  .transform(val => {
    const [, handlerId, patternId] = val.match(actionRegEx) || [];
    return { handlerId, patternId };
  });

export type ActionName = `action/${string}/${PatternId}`;
export const getActionString = (opts: {
  handlerId: string;
  patternId: string;
}): ActionName => {
  return `action/${opts.handlerId}/${opts.patternId}`;
};

export class SubmissionRegistry {
  constructor(private config: FormConfig) {}

  private handlers: Record<string, SubmitHandler> = {};

  registerHandler(opts: { handlerId: string; handler: SubmitHandler }) {
    if (opts.handlerId in this.handlers) {
      throw new Error(
        `Submission handler with id ${opts.handlerId} already exists`
      );
    }
    this.handlers[opts.handlerId] = opts.handler;
  }

  getHandlerForAction(
    form: Blueprint,
    action: string
  ): Result<{ handler: SubmitHandler; pattern: Pattern }> {
    const result = actionSchema.safeParse(action);
    if (!result.success) {
      return failure(`Invalid action: "${action}"`);
    }
    const handler = this.handlers[result.data.handlerId];
    if (handler === undefined) {
      return failure(
        `Submission handler with id ${result.data.handlerId} does not exist`
      );
    }
    const pattern = getPattern(form, result.data.patternId);
    if (pattern === undefined) {
      return failure(`Pattern with id ${result.data.patternId} does not exist`);
    }
    return success({
      handler,
      pattern,
    });
  }
}
