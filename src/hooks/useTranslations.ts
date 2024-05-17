import type { ArrayIndices } from 'type-fest';
import type { Index } from '../translations-2';

type Mapping = {
  [K in ArrayIndices<Index> as Index[K][0]]: Record<Index[K][1], string>;
};

export const useTranslations = () => {
  return {} as Mapping;
};

const x = useTranslations();

x.common.stringA;
