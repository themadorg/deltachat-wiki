---
title: importFiles
description: Документация функции importFiles для webxdc.
category: Спецификация
---

# importFiles

```js
let files = await window.webxdc.importFiles(filter);
```

Функция `importFiles()` позволяет приложению webxdc импортировать файлы. В зависимости от платформы это может открыть системное окно выбора файлов или специальное окно мессенджера. Специальное окно выбора может показывать недавние вложения, которые были получены или отправлены, чтобы упростить импорт файла, который вы только что получили (вам не нужно сначала сохранять его в файловую систему), но в нем также должна быть кнопка открытия системного окна выбора.

-   `filter`: объект со следующими свойствами:
    -   `filter.extensions`: опционально — массив расширений, которыми должен быть ограничен список файлов. Расширения должны начинаться с точки и иметь формат `.ext`. Если не указано, отображаются все файлы.
    -   `filter.mimeTypes`: опционально — массив MIME-типов, который может использоваться как подсказка (например, если у файла нет расширения). **Отображаются файлы, соответствующие либо `filter.mimeTypes`, либо `filter.extensions`**. При указании MIME-типа рекомендуется также перечислить все типичные расширения, иначе файлы могут быть пропущены. Подробнее о формате на [MDN](https://developer.mozilla.org/ru/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers).
    -   `filter.multiple`: разрешить ли выбор нескольких файлов (по умолчанию `false`).

Метод возвращает `Promise`, который разрешается в массив объектов `File`.

Пример:

```js
// then/catch
window.webxdc.importFiles({
  mimeTypes: ["text/calendar"],
  extensions: [".ics"],
}).then((files) => {
  /* сделать что-то с файлами */
}).catch((error) => {
    console.log(error);
});

// async/await
try {
  let files = await window.webxdc.importFiles({
    mimeTypes: ["text/calendar"],
    extensions: [".ics"],
  })
  /* сделать что-то с файлами */
} catch (error) {
  console.log(error);
}
```
