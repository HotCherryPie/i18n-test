import { shallowRef } from 'vue';
import { storage } from '../translations-2';

console.log('storage', storage);

type Store = (typeof storage)[string];
type Volume = keyof Store;

export const useTranslations = <TVolume extends Volume>(volume: TVolume) => {
  const str = shallowRef<Awaited<ReturnType<Store[TVolume]>>>(
    {} as Awaited<ReturnType<Store[TVolume]>>,
  );
  const promise = storage['en-US']![volume]()
    .then(async it => {
      await new Promise(r => setTimeout(r, 2000));
      return it;
    })
    .then(it => (str.value = it));

  return {
    str,
    promise,
  } as const;
};
