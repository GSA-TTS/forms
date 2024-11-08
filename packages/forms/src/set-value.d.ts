declare module 'set-value' {
  function set(obj: Record<string, any>, path: string, value: any): void;
  export = set;
}
