import type { DataType as CommonKeys } from './en-US/common';
import type { DataType as ModalAuthKeys } from './en-US/modal.auth';
import type { DataType as PageHomeKeys } from './en-US/page.home';

type I18nStorageIndex<
  TIndex extends Record<string, Record<string, string>> = Record<
    string,
    Record<string, string>
  >,
> = TIndex;

export type Index = I18nStorageIndex<{
  common: CommonKeys;
  'modal.auth': ModalAuthKeys;
  'page.home': PageHomeKeys;
}>;

// A lil hack until `import.meta.resolve` support
//  https://github.com/vitejs/vite/issues/14500
export const createI18nStorage = <TIndex extends I18nStorageIndex>(
  storage: Record<string, () => unknown>,
) =>
  Object.entries(storage)
    .map(
      ([k, v]) =>
        [
          k.slice(0, -3).split('/').slice(-2) as [string, string],
          v,
          // v.toString().match('"(.+)"')![1] as string,
        ] as const,
    )
    .reduce(
      (out, [[lang, volume], v]) => {
        out[lang] = out[lang] ?? {};
        out[lang]![volume] = v;
        return out;
      },
      {} as Record<string, Record<string, () => unknown>>,
    ) as unknown as {
    [K in keyof TIndex]: () => Promise<TIndex[K]>;
  };

export const storage = createI18nStorage<Index>(import.meta.glob('./*/*.ts'));

const x = (await storage['common']()).stringA;

// TODO: Map DataType values with `${}` to get values suggestions
