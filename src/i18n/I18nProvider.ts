import { defineComponent } from 'vue';

type Props = {
  locale: Intl.LocalesArgument;
};

export const I18nProvider = defineComponent<Props>({
  // `as unknown as undefined` used to force tooling to look at generic type `Props`
  props: ['locale'] as unknown as undefined,

  setup(_, { slots }) {
    return () => slots['default']?.();
  },
});
