# i18n-test

## TODO

### Lazy evaluation

```html
<div>{{ strings.example() }}</div>
```

- Use custom `reactive` based on [`toReactive`](https://vueuse.org/shared/toReactive/#toreactive) or [`customRef`](https://vuejs.org/api/reactivity-advanced.html#customref)
  - Should be readonly
  - Should use `Proxy` under the hood
  - With simple strings `call` hook should just return value?

### **MessageFormat**

#### Consider

- Build-time message compilation
  - [FormatJS / MF1](https://formatjs.io/docs/icu-messageformat-parser/)
  - [`@messageformat/core`](https://messageformat.github.io/messageformat/api/core.compilemodule/)

#### Implementations

**MessageFormat 1**

- [**Documentation**](https://unicode-org.github.io/icu/userguide/format_parse/messages/)

---

- [FormatJS](https://formatjs.io/docs/intl-messageformat/)
  - [**npm**](https://www.npmjs.org/package/intl-messageformat)
  - [Sources](https://github.com/formatjs/formatjs)
  - [Parser](https://formatjs.io/docs/icu-messageformat-parser)
  - [API reference](https://formatjs.io/docs/intl-messageformat/#public-api)
- [Official Polyfill](https://messageformat.github.io/messageformat/)
  - [**npm**](https://www.npmjs.com/package/@messageformat/core)
  - [Sources](https://messageformat.github.io/messageformat/)
  - [Parser](https://www.npmjs.com/package/@messageformat/parser)
  - [API reference](https://messageformat.github.io/messageformat/api/)

**MessageFormat 2**

- [**Documentation**](https://unicode-org.github.io/icu/userguide/format_parse/messages/mf2.html)
- [`Intl.MessageFormat` proposal](https://github.com/tc39/proposal-intl-messageformat)
  - [_This proposal is stuck_](https://github.com/tc39/proposal-intl-messageformat/issues/49)
- [MessageFormat Working Group](https://github.com/unicode-org/message-format-wg)

---

- [Official Polyfill](https://github.com/messageformat/messageformat/tree/main/packages/mf2-messageformat)
  - [**npm**](https://www.npmjs.com/package/messageformat)

## Устройство

- TODO

## Использование

### Добавление локализации в приложение/модуль

- TODO

### Добавление новых ключей

- TODO

### Добавление новых языков

- TODO

### Добавление новых _оверрайдов_

- TODO
