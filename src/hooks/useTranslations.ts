import type { ArrayIndices } from 'type-fest';
import type { Index } from '../translations-2';

type Volume = Index[number][0];

type Mapping = {
  [K in ArrayIndices<Index> as Index[K][0]]: Record<Index[K][1], string>;
};

export const useTranslations = <TVolume extends Volume>(volume: TVolume) => {
  return {} as Mapping[TVolume];
};

const x = useTranslations('common');

x.stringB;
