import { shallowRef, watch } from 'vue';

import type { I18nStorage } from './types';
import { useI18n } from './useI18n';

export const createUseTranslations = <const TIndex>(
  storage: I18nStorage<TIndex>,
) => {
  return <TVolume extends keyof TIndex>(volume: TVolume) => {
    const { locale } = useI18n();

    type VolumeData = TIndex[TVolume];

    const strings = shallowRef<VolumeData>({} as VolumeData);
    const promise = shallowRef<Promise<VolumeData>>();

    watch(
      () => locale.value.toString(),
      () => {
        const v = storage[locale.value.toString()]![volume]();

        if (v instanceof Promise) {
          if (promise.value === v) return;

          promise.value = v;

          v.then(it => {
            if (promise.value !== v) return;

            strings.value = it;
          }).finally(() => {
            if (promise.value !== v) return;

            promise.value = undefined;
          });
        } else {
          strings.value = v;
        }
      },
      { immediate: true },
    );

    return [strings, { promise }] as const;
  };
};
