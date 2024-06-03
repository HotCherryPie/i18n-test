import { shallowRef, watch } from 'vue';

import type {
  I18nStorage,
  GetI18nStorageVolumeData,
  GetI18nStorageVolumeNames,
  VolumeOverride,
  I18nStorageIndex,
  MessageBuilder,
  VolumeData,
} from './types';
import { useI18n } from './useI18n';
import type { Promisable } from 'type-fest';

const stubMessage = (() => '') satisfies MessageBuilder;
const stubMessages = new Proxy({}, { get: () => stubMessage });

type UseTranslationsOptions = {
  /**
   * @param e error
   * @returns boolean that indicates whether it is required to attempt to load again
   */
  onVolumeLoadFail?: (e: { error: unknown }) => Promisable<boolean | undefined>;
};

export const createUseTranslations = <
  const TIndex extends I18nStorageIndex,
  const TStore extends I18nStorage<TIndex>,
>(
  storage: TStore,
  options: UseTranslationsOptions = {},
) => {
  return <TVolumeName extends GetI18nStorageVolumeNames<TStore>>(
    volume: TVolumeName,
  ) => {
    const { locale, override } = useI18n();

    type Messages = GetI18nStorageVolumeData<TStore, TVolumeName>;

    const strings = shallowRef<Messages>(stubMessages as Messages);
    const internalLoadPromise = shallowRef<Promise<Messages>>();
    const publicLoadPromise = shallowRef<Promise<void>>();

    watch(
      [() => locale.value.toString(), () => override.value] as const,
      async ([locale_, override_]) => {
        const dictionary = storage[locale_];

        if (dictionary === undefined) {
          throw new Error(`Data for language "${locale_}" is missing`);
        }

        const overrideSpecifier =
          override_ === undefined
            ? undefined
            : (`[${override_}]` as const satisfies VolumeOverride);

        const fetcher =
          overrideSpecifier === undefined
            ? dictionary[volume]
            : dictionary[`${volume}.${overrideSpecifier}`] ??
              dictionary[volume];

        // @ts-expect-error
        let data = fetcher();

        if (!(data instanceof Promise)) {
          strings.value = data;
          return;
        }

        // Case when loading for desired locale is already pending.
        //  May happen when override changes, but it is missing for given volume,
        //  so resolved value will be same promise.
        if (internalLoadPromise.value === data) return;

        const load = Promise.withResolvers<void>();

        internalLoadPromise.value = data;
        publicLoadPromise.value = load.promise;

        let isLoadFinished = false;
        while (!isLoadFinished) {
          isLoadFinished = await data
            .then((it: VolumeData) => {
              if (internalLoadPromise.value !== data) return true;

              strings.value = it;
              load.resolve();
              internalLoadPromise.value = undefined;
              publicLoadPromise.value = undefined;

              return true;
            })
            .catch(async (error: unknown) => {
              if (internalLoadPromise.value !== data) return true;

              const needToRetry =
                (await options.onVolumeLoadFail?.({ error })) ?? false;

              if (needToRetry) return false;

              load.reject();
              internalLoadPromise.value = undefined;
              publicLoadPromise.value = undefined;

              return true;
            });

          if (!isLoadFinished) {
            // @ts-expect-error
            data = fetcher();
            internalLoadPromise.value = data;
          }
        }
      },
      { immediate: true },
    );

    return [strings, { promise: internalLoadPromise }] as const;
  };
};
