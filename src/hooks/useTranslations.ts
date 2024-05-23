import { createI18nStorage, createUseTranslations } from '@/i18n';

import { type Index, files } from '../translations';

export const storage = createI18nStorage<Index>(files);

export const useTranslations = createUseTranslations(storage);
