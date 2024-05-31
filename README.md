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

## Решаемы проблемы

- Подсказки по содержимоиму строк
- Трек неиспользуемых
- Оверрайды
- Асинхронная загрузка
- Кэш
- Минимизация зависимости от ide плагинов и cli для решения вышеприведенных проблем

## Устройство

- TODO

* volumes?
* reference language?
* keys format?
* suspense
* DictionaryID (bcp47)
  - Script
  - Numbering-system

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

Подготовить базовую файловую структуру

```
📁 src
╰📁 translations
 ├📁 en-US
 │╰📄 my-translations.ts
 ╰📄 index.ts
```

Заполните индексацию, и добавить glob импорт
Импортировать надо только не оверрайд файлы и только из того языка, в котором хотите получать подсказки по содержимому строк.

```ts
// src/translations/index.ts

import type { DataType as MyTranslations } from './en-US/my-translations';

export type Index = {
  'my-translations': MyTranslations;
};

export const files = import.meta.glob('./*/*.ts');
```

Далее нужно инициализировать хук `useTranslations`

```ts
// src/hooks/useTranslations.ts

import { createI18nStorage, createUseTranslations } from '@/utils/i18n';

import { type Index, files } from './translations';

export const storage = createI18nStorage<Index>(files);

export const useTranslations = createUseTranslations(storage);
```

### Добавление новых ключей

- TODO

### Добавление новых языков

- Структура и набор ключей должны быть идентичны референсному языку
- Наследования языков пока не предусмотрено

### Добавление новых _оверрайдов_

- К файлам оверрайдов применяются те же правила, что и к другим файлам переводов, А именно
  - Оверрайды должны быть во всех языках
  - Набор ключей должен быть идентичен во всех файлах
- Набор ключей в файле-оверрайде должен быть идентичен оригинальному файлу
