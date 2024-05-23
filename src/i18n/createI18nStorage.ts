import type { I18nStorage, I18nStorageIndex } from './types';

export const createI18nStorage = <TIndex extends I18nStorageIndex>(
  storage: Record<string, () => Promise<unknown>>,
) =>
  Object.entries(storage)
    .map(
      ([k, v]) =>
        [k.slice(0, -3).split('/').slice(-2) as [string, string], v] as const,
    )
    .reduce(
      (out, [[lang, volume], v]) => {
        out[lang] = out[lang] ?? {};
        out[lang]![volume] = v;
        return out;
      },
      {} as Record<string, Record<string, () => Promise<unknown>>>,
    ) as I18nStorage<TIndex>;
