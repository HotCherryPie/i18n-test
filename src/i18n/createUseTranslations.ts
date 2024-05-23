import { shallowRef, watch } from 'vue';

import type { I18nStorage } from './types';
import { useI18n } from './useI18n';

const sleep = async <T>(e: T) => (
  await new Promise(r => setTimeout(r, 2000)), e
);

export const createUseTranslations = <const TIndex>(
  storage: I18nStorage<TIndex>,
) => {
  return <TVolume extends keyof TIndex>(volume: TVolume) => {
    const { locale } = useI18n();

    type VolumeData = TIndex[TVolume];

    const strings = shallowRef<VolumeData>({} as VolumeData);
    const promise = shallowRef<Promise<void>>();

    watch(
      () => locale.value.toString(),
      () => {
        promise.value = storage[locale.value.toString()]![volume]()
          .then(sleep)
          .then(it => {
            strings.value = it.default;
          });
      },
      { immediate: true },
    );

    return [strings, { promise }] as const;
  };
};
