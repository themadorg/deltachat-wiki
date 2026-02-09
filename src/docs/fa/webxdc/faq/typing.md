---
title: پشتیبانی TypeScript
description: مستندات پشتیبانی TypeScript برای webxdc.
category: FAQ
---


# پشتیبانی TypeScript

## چگونه تکمیل خودکار در IDE خود از طریق TypeScript داشته باشیم؟

بسته نود [webxdc-types](https://www.npmjs.com/package/webxdc-types#types-for-webxdc) را از طریق `npm` نصب کنید
و [دستورالعمل‌های README آن](https://www.npmjs.com/package/webxdc-types#usage) را دنبال کنید.

به‌عنوان جایگزین،
[`webxdc.d.ts`](https://github.com/webxdc/webxdc-types/blob/main/webxdc.d.ts)
را در پوشه سورس خود کپی کنید و دستورالعمل‌های زیر را دنبال کنید.

### نحوه استفاده از تایپ‌های webxdc؟

با import کردن فایل شروع کنید.

در TypeScript:

```typescript
import type { Webxdc } from './webxdc.d.ts'
```

در JavaScript:

```javascript
/**
 * @typedef {import('./webxdc').Webxdc} Webxdc
 */
```

این در VS Code به‌خوبی همراه با کامنت `//@ts-check` در بالای فایل سورس شما کار می‌کند.

اگر بخواهید می‌توانید توابع خود را نیز با استفاده از [کامنت‌های JSDoc](https://jsdoc.app/) تایپ کنید.

> اگر از VS Code استفاده نمی‌کنید همچنان می‌توانید با کامپایلر TypeScript از بررسی تایپ استفاده کنید:
>
> ```sh
> npm i -g typescript # -g برای نصب سراسری
> tsc --noEmit --allowJs --lib es2015,dom *.js
> ```

### چگونه تایپ بارداده به‌روزرسانی برنامه خود را اضافه کنیم؟

اگر تایپی برای **بارداده‌های** به‌روزرسانی وضعیت خود دارید، `any` را در `Webxdc<any>` با تایپ بارداده خود جایگزین کنید:

```typescript
declare global {
  interface Window {
    webxdc: Webxdc<any>;
  }
}
```


