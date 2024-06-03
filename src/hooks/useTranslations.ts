import { createI18nStorage, createUseTranslations } from '@/i18n';

import { type Index, files } from '@/translations';

export const storage = createI18nStorage<Index>(files);

const sleep = async <T>(e?: T) => (
  await new Promise(r => setTimeout(r, 2000)), e
);

export const useTranslations = createUseTranslations(storage, {
  async onVolumeLoadFail() {
    await sleep();
    return true;
  },
});
