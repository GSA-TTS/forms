/**
 * Exports `createService`, which creates a service object from a context and a
 * set of service functions.
 * Each service function takes a context as its first argument, with subsequent
 * arguments being the function's parameters.
 */
type ServiceFunction<Args extends any[], Return, Context> = (
  context: Context,
  ...args: Args
) => Return;

export type ServiceMethod<F extends ServiceFunction<any, any, any>> =
  F extends (context: infer C, ...args: infer A) => infer R
    ? (...args: A) => R
    : never;

type ServiceFunctions<Context> = {
  [key: string]: ServiceFunction<any[], any, Context>;
};

type WithoutFirstArg<F> = F extends (context: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

type Service<
  Context extends any,
  Functions extends ServiceFunctions<Context>,
> = {
  [K in keyof Functions]: WithoutFirstArg<Functions[K]>;
} & { getContext: () => Context };

export const createService = <
  Context extends any,
  Functions extends ServiceFunctions<Context>,
>(
  ctx: Context,
  serviceFunctions: Functions
): Service<Context, Functions> => {
  const handler: ProxyHandler<Functions> = {
    get(target: Functions, prop: string | symbol) {
      if (prop === 'getContext') {
        return () => ctx;
      }
      const propKey = prop as keyof Functions;
      const originalFn = target[propKey];
      if (originalFn === undefined) {
        return undefined;
      }
      return (...args: any[]) =>
        (originalFn as Function).call(null, ctx, ...args);
    },
  };

  return new Proxy(serviceFunctions, handler) as unknown as Service<
    Context,
    Functions
  >;
};
