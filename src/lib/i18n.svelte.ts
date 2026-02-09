import { goto } from '$app/navigation';
import { setContext, getContext } from 'svelte';
import { supportedLanguages, supportedLangCodes } from './languages';
export { supportedLanguages, supportedLangCodes };
import en from './i18n/en.json';
import fa from './i18n/fa.json';
import ru from './i18n/ru.json';

const translationMap: Record<string, any> = { en, fa, ru };

type SupportedLangCode = (typeof supportedLangCodes)[number];

export class I18n {
    lang = $state('fa');
    translations = $derived(translationMap[this.lang] || translationMap.en);
    dir = $derived(supportedLanguages.find(l => l.code === this.lang)?.dir || 'ltr');

    constructor(initialLang: string) {
        this.lang = supportedLangCodes.includes(initialLang as any) ? initialLang : 'fa';
    }

    /**
     * Sync the i18n state to match the URL.
     * Called reactively from layouts when the URL param changes.
     * This is a passive update — it does NOT trigger navigation.
     */
    syncFromUrl(urlLang: string) {
        if (translationMap[urlLang] && this.lang !== urlLang) {
            this.lang = urlLang;
        }
    }

    /**
     * Switch language by navigating to the equivalent URL with the new lang prefix.
     * The URL is the single source of truth — this triggers a goto() which will
     * flow through SvelteKit's load functions and then syncFromUrl().
     */
    setLang(newLang: string) {
        if (!translationMap[newLang] || newLang === this.lang) return;

        const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
        const pathParts = pathname.split('/');

        // Replace the lang segment in the URL
        if (supportedLangCodes.includes(pathParts[1] as any)) {
            pathParts[1] = newLang;
        } else {
            pathParts.splice(1, 0, newLang);
        }

        const newPath = pathParts.join('/') || '/';
        goto(newPath, { replaceState: true });
    }

    t(key: string) {
        return this.translations[key] || key;
    }
}

const I18N_KEY = Symbol('i18n');

export function setI18n(initialLang: string) {
    const i18n = new I18n(initialLang);
    return setContext(I18N_KEY, i18n);
}

export function getI18n() {
    return getContext<I18n>(I18N_KEY);
}
