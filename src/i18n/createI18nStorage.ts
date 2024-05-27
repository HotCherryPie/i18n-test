import type { I18nStorage, I18nStorageIndex, VolumeData } from './types';

type CacheKey = string;

type VolumeImportFn = () => Promise<unknown>;

type VolumeModule = { default: VolumeData };

type CacheValue = VolumeData | Promise<VolumeData>;

const cache = new Map<CacheKey, CacheValue>();

const sleep = async <T>(e: T) => (
  await new Promise(r => setTimeout(r, 2000)), e
);

export const createI18nStorage = <TIndex extends I18nStorageIndex>(
  imports: Record<string, VolumeImportFn>,
) => {
  const getVolumeGetter = (key: CacheKey, fetcher: VolumeImportFn) => () => {
    if (!cache.has(key)) {
      cache.set(
        key,
        fetcher()
          .then(sleep)
          .then(module => {
            const data = (module as unknown as VolumeModule).default;
            cache.set(key, data);
            return data;
          }),
      );
    }

    return cache.get(key)!;
  };

  return Object.entries(imports)
    .map(([k, v]) => {
      const [lang, volumeName] = k.slice(0, -3).split('/').slice(-2) as [
        string,
        string,
      ];

      const cacheKey = `${lang}/${volumeName}`;

      return [[lang, volumeName], getVolumeGetter(cacheKey, v)] as const;
    })
    .reduce(
      (out, [[lang, volumeName], v]) => {
        out[lang] = out[lang] ?? {};
        out[lang]![volumeName] = v;
        return out;
      },
      {} as Record<string, Record<string, () => CacheValue>>,
    ) as I18nStorage<TIndex>;
};
