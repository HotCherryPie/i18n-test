import { shallowRef, watch } from 'vue';

import type { I18nStorage, I18nStorageIndex, VolumeOverride } from './types';
import { useI18n } from './useI18n';

export const createUseTranslations = <const TIndex extends I18nStorageIndex>(
  storage: I18nStorage<TIndex>,
) => {
  return <TVolume extends keyof TIndex & string>(volume: TVolume) => {
    const { locale, override } = useI18n();

    type VolumeData = TIndex[TVolume];

    const strings = shallowRef<VolumeData>({} as VolumeData);
    const promise = shallowRef<Promise<VolumeData>>();

    watch(
      () => locale.value.toString(),
      value => {
        const lib = storage[value]!;

        const overrideSpecifier =
          override.value === undefined
            ? undefined
            : (`[${override.value}]` satisfies VolumeOverride);

        const fetcher =
          overrideSpecifier === undefined
            ? lib[volume]
            : lib[`${volume}.${overrideSpecifier}`] ?? lib[volume];

        // @ts-expect-error
        const data = fetcher();

        if (data instanceof Promise) {
          if (promise.value === data) return;

          promise.value = data;

          data
            .then(it => {
              if (promise.value !== data) return;

              strings.value = it;
            })
            .finally(() => {
              if (promise.value !== data) return;

              promise.value = undefined;
            });
        } else {
          strings.value = data;
        }
      },
      { immediate: true },
    );

    return [strings, { promise }] as const;
  };
};
