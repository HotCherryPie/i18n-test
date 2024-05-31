# i18n-test

## TODO

- Build-time overrides merging?
- Base language merging? (`en-NG` <- `en-US`)

### **MessageFormat**

#### Consider

- Lazy evaluation
  - Use custom `reactive` based on [`toReactive`](https://vueuse.org/shared/toReactive/#toreactive) or [`customRef`](https://vuejs.org/api/reactivity-advanced.html#customref)
    - Should be readonly
    - Should use `Proxy` under the hood
    - With simple strings `call` hook should just return value
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

## Глоссарий

- **Строка** — пара ключ-значение, с текстовой информацией для перевода.
- **Словарь** — Набор строк под конкретный язык/локаль.
- **Том** — Подмножество строк из словаря.
- **Оверрайд** — Том с перегрузками строк для выбранного тома.

## Решаемы проблемы

Помимо решения основной проблемы (поддержка переводов приложения на разные языки), были учтены следующие хотелки:

- Поддержка оверрайдов для выбранных томов.
- Возможность разбиение словаря на отдельные тома, с возможность их асинхронной загрузки.
- Автокомплит ключей строк.
- Трек неиспользуемых строк.
- Минимизация зависимости от сторонних IDE плагинов и cli для решения вышеприведенных проблем.

## Устройство

### Тома

Файлы с набором строк. У каждого тома может быть один или несколько оверрайдов. Если вам нужна модалка, которая должна быть только от отдельном гео, под который выделен отдельный оверрайд, то базовый том можно не создавать.

### Словари

Словарь представляет из себя папку, содержащую файлы отдельных томов. Именем словаря может является любой корректный **BCP47** тэг.

> **Внимание**
> Наследования переводов, как это было сделано в рамках старого ланга, сейчас не предусмотренно.

> **Внимание**
> Механизм матчинга локалей (locale negotiation) не предусмотрен, поэтому ожидается, что названия словарей будут соответствовать запрашиваемым клиентским приложением локалям.

### Файловая структура

Пример файловой структуры

```
📁 src
╰📁 translations
 ├📄 index.ts
 ├📁 en-US
 │├📄 common.ts
 │├📄 page-home.ts
 │╰📄 page-home.[mx-domain].ts
 ╰📁 ru-RU
  ├📄 common.ts
  ├📄 page-home.ts
  ╰📄 page-home.[mx-domain].ts
```

Корневую папку можно назвать и положить куда угодно, не обязательно в `src/translations`.

### Структура файла переводов

```ts
enum Data {
  myString = 'My string',
}

export default Data;

export type DataType = typeof Data;
```

Для хранения строк используется TS `enum`, т.к. такой формат поддерживается TMS системами вроде **Crowdin** и **Localazy**, и позволяет добиться автокомплита, и трекинга используемости ключей, исключительно средствами IDE.

## Использование

### Добавление локализации в приложение/модуль

Подготовить базовую файловую структуру:

```
📁 src
╰📁 translations
 ├📄 index.ts
 ╰📁 en-US
  ╰📄 my-translations.ts
```

Заполните индексацию, и добавьте glob импорт для файлов томов. Для индексации надо указывать только оригинальные, не оверрайд, версии томов:

```ts
// src/translations/index.ts

import type { DataType as MyTranslations } from './en-US/my-translations';

export type Index = {
  'my-translations': MyTranslations;
};

export const files = import.meta.glob('./*/*.ts');
```

Далее нужно инициализировать хук `useTranslations`:

```ts
// src/hooks/useTranslations.ts

import { createI18nStorage, createUseTranslations } from '@/utils/i18n';

import { type Index, files } from './translations';

export const storage = createI18nStorage<Index>(files);

export const useTranslations = createUseTranslations(storage);
```

Затем обернуть свое приложение/модуль компонентом `<I18nProvider>` и передать в него тэг/класс требуемой локали, и опционально название желаемого оверрайда:

```vue
<!-- src/App.vue -->

<template>
  <I18nProvider locale="en-US" override="mx-domain">
    <!-- ... -->
  </I18nProvider>
</template>
```
