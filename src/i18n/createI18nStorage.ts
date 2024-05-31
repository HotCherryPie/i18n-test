import type {
  I18nStorage,
  I18nStorageIndex,
  VolumeData,
  DictionaryId,
  VolumeResourceId,
  VolumeIndex,
  I18nStorageVolume,
} from './types';

// Return value of `import.meta.glob`
type VolumeGlobImports = Record<string, () => Promise<unknown>>;

type VolumeGlobImportFn = VolumeGlobImports[string];

type VolumeModule = { default: VolumeIndex };

type VolumeModuleData = VolumeModule['default'];

type CacheKey = `${DictionaryId}/${VolumeResourceId}`;

type CacheValue = I18nStorageVolume;

const cache = new Map<CacheKey, CacheValue>();

const sleep = async <T>(e: T) => (
  await new Promise(r => setTimeout(r, 2000)), e
);

const wrapVolumeWithMessageBuilders = (volumeDataRaw: VolumeModuleData) => {
  const out: VolumeData = {};

  for (const [key, value] of Object.entries(volumeDataRaw))
    out[key] = () => value;

  return out;
};

const getVolumeGetter = (key: CacheKey, fetcher: VolumeGlobImportFn) => () => {
  if (!cache.has(key)) {
    cache.set(
      key,
      fetcher()
        .then(sleep)
        .then(module => {
          const data = wrapVolumeWithMessageBuilders(
            (module as unknown as VolumeModule).default,
          );
          cache.set(key, data);
          return data;
        }),
    );
  }

  return cache.get(key)!;
};

export const createI18nStorage = <TIndex extends I18nStorageIndex>(
  imports: VolumeGlobImports,
) => {
  return Object.entries(imports)
    .map(([k, v]) => {
      const [dictionaryId, volumeResourceId] = k
        .slice(0, -3)
        .split('/')
        .slice(-2) as [DictionaryId, VolumeResourceId];

      const cacheKey = `${dictionaryId}/${volumeResourceId}` satisfies CacheKey;

      return [
        dictionaryId,
        volumeResourceId,
        getVolumeGetter(cacheKey, v),
      ] as const;
    })
    .reduce(
      (out, [dictionaryId, volumeResourceId, volumeGetter]) => {
        out[dictionaryId] = out[dictionaryId] ?? {};
        out[dictionaryId]![volumeResourceId] = volumeGetter;
        return out;
      },
      {} as Record<DictionaryId, Record<VolumeResourceId, () => CacheValue>>,
    ) as I18nStorage<TIndex>;
};
