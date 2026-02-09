import { browser } from "$app/environment";
import { page } from "$app/state";
import { goto } from "$app/navigation";

/**
 * Zen mode store — syncs with `?zen=true` URL parameter.
 * 
 * - Reading: derives from `page.url.searchParams` (single source of truth)
 * - Writing: uses `goto()` for SvelteKit-safe URL updates (no race conditions)
 */

// Guard against concurrent navigation
let _navigating = false;

export const zen = {
    get active(): boolean {
        if (!browser) return false;
        return page.url.searchParams.get("zen") === "true";
    },

    async enable() {
        if (_navigating || !browser) return;
        _navigating = true;
        try {
            const url = new URL(page.url);
            url.searchParams.set("zen", "true");
            await goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
        } finally {
            _navigating = false;
        }
    },

    async disable() {
        if (_navigating || !browser) return;
        _navigating = true;
        try {
            const url = new URL(page.url);
            url.searchParams.delete("zen");
            await goto(url.toString(), { replaceState: true, keepFocus: true, noScroll: true });
        } finally {
            _navigating = false;
        }
    },

    async toggle() {
        if (this.active) {
            await this.disable();
        } else {
            await this.enable();
        }
    }
};
