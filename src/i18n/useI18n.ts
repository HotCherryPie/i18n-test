import { inject } from 'vue';
import { I18nContext } from './I18nProvider';

export const useI18n = () => {
  const context = inject(I18nContext);

  if (context === undefined) throw new Error('I18nContext is missing');

  const { locale } = context;

  return {
    locale,
  } as const;
};
