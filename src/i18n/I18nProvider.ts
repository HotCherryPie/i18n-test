import {
  computed,
  defineComponent,
  provide,
  type InjectionKey,
  type Ref,
} from 'vue';

export const I18nContext = Symbol() as InjectionKey<{
  locale: Readonly<Ref<Intl.Locale>>;
}>;

type Props = {
  locale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale;
};

export const I18nProvider = defineComponent<Props>({
  // `as unknown as undefined` used to force tooling to look at generic type `Props`
  props: ['locale'] as unknown as undefined,

  setup(props, { slots }) {
    provide(I18nContext, {
      locale: computed(() => new Intl.Locale(props.locale)),
    });

    return () => slots['default']?.();
  },
});
