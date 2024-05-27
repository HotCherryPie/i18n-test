import {
  computed,
  defineComponent,
  provide,
  toRef,
  type InjectionKey,
  type Ref,
} from 'vue';

export const I18nContext = Symbol() as InjectionKey<{
  locale: Readonly<Ref<Intl.Locale>>;
  override: Readonly<Ref<string | undefined>>;
}>;

type Props = {
  locale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale;
  override?: string | undefined;
};

export const I18nProvider = defineComponent<Props>({
  // `as unknown as undefined` used to force tooling to look at generic type `Props`
  props: ['locale', 'override'] as unknown as undefined,

  setup(props, { slots }) {
    provide(I18nContext, {
      locale: computed(() => new Intl.Locale(props.locale)),
      override: toRef(() => props.override),
    });

    return () => slots['default']?.();
  },
});
