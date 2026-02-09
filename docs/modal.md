# Modal System in Delta Chat Guide

We've implemented a custom, premium modal system for the language selector. This ensures a consistent and high-quality user experience across the site.

## Language Modal

The language modal is a global component that handles language switching with a beautiful backdrop blur and scale transitions.

### How it works

1.  **Trigger**: Clicking the globe icon (`Languages` from Lucide) in the top navigation.
2.  **State Management**: Uses Svelte 5 `$state` and `$bindable` to control visibility.
3.  **Transitions**:
    *   `fade`: Smoothly brings in the backdrop blur.
    *   `scale`: Scales the modal content from 95% to 100% for a "pop-in" effect.
4.  **Interaction**:
    *   Clicking an option calls `i18n.setLang(code)`.
    *   Closes on backdrop click or Escape key.
    *   Current language is highlighted with a `Check` icon.

## Reusable Modal Pattern

If you need to create more modals, follow the pattern in `src/lib/components/modals/LanguageModal.svelte`:

1.  **Backdrop**: Use a fixed-position `div` with `backdrop-filter: blur(8px)`.
2.  **Content**: Use a nested `div` with `onclick={(e) => e.stopPropagation()}` to prevent closing when clicking inside.
3.  **Accessibility**:
    *   Add `role="dialog"` and `aria-modal="true"`.
    *   Ensure the modal can be closed via keyboard (Escape).
    *   Manage focus if necessary (for complex modals).

## Styles

Moals use the project's color palette:
-   **Background**: `#0f172a` (Slate-950)
-   **Border**: Semi-transparent white (`rgba(255, 255, 255, 0.1)`)
-   **Accent**: Blue-500 (`#3b82f6`) for active states and primary icons.
