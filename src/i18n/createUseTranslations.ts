import { shallowRef } from 'vue';

import type { I18nStorage } from './types';

const lang = 'en-US';

const sleep = async <T>(e: T) => (
  await new Promise(r => setTimeout(r, 2000)), e
);

export const createUseTranslations = <const TIndex>(
  storage: I18nStorage<TIndex>,
) => {
  return <TVolume extends keyof TIndex>(volume: TVolume) => {
    type VolumeData = TIndex[TVolume];

    const str = shallowRef<VolumeData>({} as VolumeData);

    const promise = storage[lang]![volume]()
      .then(sleep)
      .then(it => {
        str.value = it.default;
      });

    return [str, { promise }] as const;
  };
};
