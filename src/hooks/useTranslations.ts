import { storage } from '../translations-2';

console.log('>>>>>>', storage);

export const useTranslations = <TVolume extends string>(volume: TVolume) => {
  return {} as Record<string, string>;
};
