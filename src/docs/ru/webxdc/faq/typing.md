---
title: Поддержка TypeScript
description: Документация по поддержке TypeScript в webxdc.
category: FAQ
---

# Поддержка TypeScript

## Как получить автодополнение в IDE через TypeScript?

Установите npm-пакет [webxdc-types](https://www.npmjs.com/package/webxdc-types#types-for-webxdc) и следуйте [инструкциям в его README](https://www.npmjs.com/package/webxdc-types#usage).

В качестве альтернативы скопируйте файл [`webxdc.d.ts`](https://github.com/webxdc/webxdc-types/blob/main/webxdc.d.ts) в директорию с вашим исходным кодом и следуйте инструкциям ниже.

### Как использовать типы webxdc?

Начните с импорта файла.

В TypeScript:
```typescript
import type { Webxdc } from './webxdc.d.ts'
```

В JavaScript:
```javascript
/**
 * @typedef {import('./webxdc').Webxdc} Webxdc
 */
```

Это отлично работает в VS Code вместе с комментарием `//@ts-check` в начале вашего файла с исходным кодом.

При желании вы также можете типизировать свои собственные функции, используя [комментарии JSDoc](https://jsdoc.app/).

> Если вы не используете VS Code, вы всё равно можете проводить проверку типов с помощью компилятора TypeScript:
>
> ```sh
> npm i -g typescript   # -g означает глобальную установку
> tsc --noEmit --allowJs --lib es2015,dom *.js
> ```

### Как добавить свой собственный тип полезной нагрузки (payload) для обновлений?

Если у вас есть тип для **полезной нагрузки** обновлений состояния вашего приложения, замените `any` в `Webxdc<any>` на ваш тип:

```typescript
declare global {
  interface Window {
    webxdc: Webxdc<any>;
  }
}
```
