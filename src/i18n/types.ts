export type I18nStorageIndex = Record<string, Record<string, string>>;

export type I18nStorage<TIndex = unknown> = Record<
  string,
  { [K in keyof TIndex]: () => Promise<{ default: TIndex[K] }> }
>;
