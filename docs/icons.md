# Lucide Icons in Delta Chat Guide

We use `@lucide/svelte` for all icons in this project. Lucide provides a set of consistent, beautiful, and tree-shakable icons.

## Installation

```bash
bun add @lucide/svelte
```

## How to use

Each icon is a reactive Svelte component. You can import them from the main package or directly from the icons directory for better performance.

### Basic Usage

```svelte
<script>
  import { Zap } from '@lucide/svelte';
</script>

<Zap size={24} color="currentColor" strokeWidth={2} />
```

### Direct Imports (Recommended)

Direct imports help with build times and ensure better tree-shaking in some environments.

```svelte
<script>
  import Zap from '@lucide/svelte/icons/zap';
</script>

<Zap />
```

## Props

The icons accept several props to customize their appearance:

- `size`: (number) The size of the icon in pixels (default: 24).
- `color`: (string) The color of the icon (default: "currentColor").
- `strokeWidth`: (number) The width of the icon's strokes (default: 2).
- `absoluteStrokeWidth`: (boolean) Whether to use absolute stroke width (default: false).

All standard SVG attributes are also supported as props.

## Generic Icon Component

If you need to render an icon dynamically based on a string name:

```svelte
<script>
  import * as Icons from '@lucide/svelte';
  let { name, ...props } = $props();

  const IconComponent = Icons[name];
</script>

{#if IconComponent}
  <IconComponent {...props} />
{/if}
```

> **Warning**: Importing `* as Icons` will include all icons in your bundle unless your bundler is very good at tree-shaking. Use with caution.
