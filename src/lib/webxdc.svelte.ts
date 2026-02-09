/**
 * Webxdc detection and external link handling.
 * 
 * During build-xdc.js, `window.__WEBXDC__ = true` is injected into all HTML files.
 * This module checks for that flag and intercepts external links.
 */
import { browser } from '$app/environment';

// Global: is this app running inside a webxdc container?
export const isWebxdc = browser && (window as any).__WEBXDC__ === true;

// Reactive state for the external link modal
let _show = $state(false);
let _url = $state('');

export const externalLink = {
    get show() { return _show; },
    get url() { return _url; },
    open(url: string) { _url = url; _show = true; },
    close() { _show = false; _url = ''; },
};

/** Check if a URL points outside this app */
function isExternal(href: string): boolean {
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return true;
    if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
            return new URL(href, window.location.origin).origin !== window.location.origin;
        } catch { return true; }
    }
    return false;
}

/**
 * Global click handler — attach to document in onMount.
 * Intercepts clicks on <a> tags with external hrefs when in webxdc mode.
 */
export function handleExternalClick(e: MouseEvent) {
    if (!isWebxdc) return;
    const anchor = (e.target as HTMLElement)?.closest?.('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href && isExternal(href)) {
        e.preventDefault();
        e.stopPropagation();
        externalLink.open(href);
    }
}
