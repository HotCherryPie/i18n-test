import { shallowRef, watch } from 'vue';

import type {
  I18nStorage,
  GetI18nStorageVolumeData,
  GetI18nStorageVolumeNames,
  VolumeOverride,
  I18nStorageIndex,
} from './types';
import { useI18n } from './useI18n';

const stubMessage = () => 'stub';
const stubMessages = new Proxy(
  {},
  {
    get: () => stubMessage,
  },
);

export const createUseTranslations = <
  const TIndex extends I18nStorageIndex,
  const TStore extends I18nStorage<TIndex>,
>(
  storage: TStore,
) => {
  return <TVolumeName extends GetI18nStorageVolumeNames<TStore>>(
    volume: TVolumeName,
  ) => {
    const { locale, override } = useI18n();

    type Messages = GetI18nStorageVolumeData<TStore, TVolumeName>;

    const strings = shallowRef<Messages>(stubMessages as Messages);
    const promise = shallowRef<Promise<Messages>>();

    watch(
      () => locale.value.toString(),
      value => {
        const lib = storage[value];

        if (lib === undefined) {
          throw new Error(`Data for language "${value}" is missing`);
        }

        const overrideSpecifier =
          override.value === undefined
            ? undefined
            : (`[${override.value}]` as const satisfies VolumeOverride);

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
