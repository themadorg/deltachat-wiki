---
title: Contribuir a deltachat.wiki
description: Cómo contribuir a la wiki de Delta Chat — corregir errores, añadir contenido y ayudar a traducir la documentación a más idiomas.
category: Primeros pasos
order: 6
---

# Contribuir a deltachat.wiki

¡Gracias por tu interés en contribuir a **deltachat.wiki**! Este es un proyecto de documentación no oficial e impulsado por la comunidad para [Delta Chat](https://delta.chat). Cada contribución ayuda a mejorar el proyecto para todos.

Este proyecto está licenciado bajo **GNU GPLv3 (Copyleft)** — eres libre de usarlo, modificarlo y compartirlo.

---

## Cómo contribuir

### 1. Haz un fork del repositorio

Todas las contribuciones se realizan mediante **Pull Requests**. Comienza haciendo un fork del proyecto:

1. Visita [github.com/themadorg/deltachat-wiki](https://github.com/themadorg/deltachat-wiki)
2. Haz clic en el botón **Fork** en la esquina superior derecha
3. Clona tu fork localmente:
   ```sh
   git clone https://github.com/YOUR_USERNAME/deltachat-wiki.git
   cd deltachat-wiki
   ```
4. Instala las dependencias:
   ```sh
   bun install
   ```
5. Inicia el servidor de desarrollo:
   ```sh
   bun run dev
   ```

### 2. Realiza tus cambios

Crea una nueva rama, haz tus ediciones y confirma los cambios:

```sh
git checkout -b my-contribution
# ... haz tus cambios ...
git add .
git commit -m "docs: descripción de los cambios"
```

### 3. Envía un Pull Request

Sube tu rama y abre un PR contra la rama `main`:

```sh
git push origin my-contribution
```

Luego ve a tu fork en GitHub y haz clic en **"Compare & pull request"**.

---

## Reportar y corregir errores

### Errores factuales o conceptuales

Si encuentras contenido que es **factualmente incorrecto** o describe un concepto de manera errónea:

1. **Corrígelo primero en la versión en inglés (`en`)** — el inglés es el idioma fuente principal
2. En la descripción de tu PR, **explica claramente qué estaba mal y qué corregiste**
3. **Solicita que la corrección se aplique en todos los demás idiomas** añadiendo una nota como:

> ⚠️ Este PR corrige un error factual en `src/docs/en/general/privacy.md`. La misma corrección debe aplicarse a las versiones en `fa`, `ru` y `es`.

Esto asegura que la información incorrecta no permanezca en las versiones traducidas.

### Errores de traducción

Si notas que una **traducción no coincide con el significado** del texto original en inglés:

1. **Abre un Issue** o envía un PR
2. Especifica claramente:
   - Qué archivo está afectado
   - En qué idioma está el error
   - Qué dice el texto actualmente
   - Qué debería decir

**Ejemplo de Issue:**

> 🌐 Error de traducción en `src/docs/es/general/privacy.md`
> El párrafo sobre cifrado de extremo a extremo actualmente dice "..." pero el texto original en inglés dice "...". La traducción correcta al español debería ser "..."

### Erratas y gramática

- **Erratas en inglés:** corrígelas directamente y envía un PR
- **Otros idiomas:** si hablas el idioma, corrígelas directamente. Si no, abre un Issue describiendo qué parece incorrecto y en qué archivo/idioma

---

## Escribir documentación

### Estructura de archivos

Las páginas de documentación son archivos Markdown con encabezado YAML:

```markdown
---
title: Título de la página
description: Breve descripción del contenido de la página
category: Nombre de la categoría
order: 1
---

Tu contenido aquí...
```

### Dónde colocar los archivos

```
src/docs/
├── en/          ← Inglés (fuente principal)
│   ├── general/
│   ├── webxdc/
│   ├── bot/
│   └── servers/
├── fa/          ← Traducciones al persa
├── ru/          ← Traducciones al ruso
└── es/          ← Traducciones al español
```

### Navegación en la barra lateral

Cada sección tiene un archivo `config.ts` que define el orden de las páginas en la barra lateral:

```typescript
export const sidebarConfig = [
    { title: "Introducción", slug: "general/introduction" },
    { title: "Características", slug: "general/features" },
    // Añade tu nueva página aquí
];
```

**¡No olvides actualizar `config.ts`** al añadir una nueva página!

---

## Guía de traducción

Esta wiki está disponible en **inglés**, **persa (فارسی)**, **ruso (Русский)** y **español**.

### Reglas para traductores

1. **Siempre traduce desde el inglés** — nunca traduzcas desde otra traducción
2. **Mantén la misma ruta de archivo** — `en/general/features.md` → `es/general/features.md`
3. **Traduce los valores del encabezado** — traduce `title` y `description`, deja las demás claves sin cambios
4. **No traduzcas bloques de código** — los ejemplos de código permanecen en su forma original
5. **Mantén los términos técnicos** en su forma original a menos que exista un equivalente local ampliamente aceptado
6. **Mantén los slugs de URL en inglés** — las rutas deben ser consistentes en todos los idiomas
7. **Actualiza las cadenas de la interfaz** — si añades nuevas claves en `en.json`, añádelas también en los archivos de los otros idiomas

### Archivos de traducción de la interfaz

La interfaz del sitio (navegación, botones, pie de página, etc.) se traduce mediante archivos JSON:

```
src/lib/i18n/
├── en.json    ← Fuente
├── fa.json
├── ru.json
└── es.json
```

---

## Añadir un nuevo idioma

¿Quieres añadir soporte para un nuevo idioma? Así es cómo:

1. Añade el idioma a `src/lib/languages.ts`:
   ```typescript
   { code: 'de', name: 'Deutsch', dir: 'ltr' }
   ```
2. Crea `src/lib/i18n/de.json` — copia de `en.json` y traduce
3. Registra la traducción en `src/lib/i18n.svelte.ts`
4. Empieza a traducir documentación en `src/docs/de/`
5. Crea archivos `config.ts` de barra lateral para cada sección

El sistema de compilación detectará automáticamente el nuevo idioma para enrutamiento, pre-renderizado y el selector de idioma.

---

## Directrices para Pull Requests

### Convención de títulos de PR

Usa prefijos claros y estándar:

| Prefijo | Uso |
|---------|-----|
| `docs:` | Añadir o actualizar contenido de documentación |
| `fix:` | Corregir errores factuales o bugs |
| `i18n:` | Añadir nuevas traducciones |
| `i18n-fix:` | Corregir errores de traducción |
| `feat:` | Añadir nuevas funcionalidades |

### Lista de verificación antes de enviar

- [ ] Los cambios compilan sin errores (`bun run build`)
- [ ] El contenido es preciso y está bien escrito
- [ ] El encabezado (`title`, `description`, `category`, `order`) es correcto
- [ ] `config.ts` de la barra lateral está actualizado (si se añade una nueva página)
- [ ] Si se corrigió un error de contenido, los otros idiomas están marcados para actualización
- [ ] La descripción del PR explica qué cambió y por qué

---

## ¿Tienes preguntas?

- Abre un [Issue en GitHub](https://github.com/themadorg/deltachat-wiki/issues)
- Únete al [Foro de Soporte de Delta Chat](https://support.delta.chat/)

¡Gracias por ayudar a hacer la documentación de Delta Chat accesible para todos! ❤️
