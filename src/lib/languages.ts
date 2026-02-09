export const supportedLanguages = [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'fa', name: 'فارسی', dir: 'rtl' },
    { code: 'ru', name: 'Русский', dir: 'ltr' }
] as const;

export const supportedLangCodes = supportedLanguages.map(l => l.code);
type SupportedLangCode = (typeof supportedLangCodes)[number];
