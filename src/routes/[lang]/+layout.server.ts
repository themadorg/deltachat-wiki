import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supportedLangCodes } from '$lib/i18n.svelte';

export const load: LayoutServerLoad = ({ params, locals }) => {
    const { lang } = params;

    if (!supportedLangCodes.includes(lang as any)) {
        throw error(404, 'Not found');
    }

    // Update locals.lang to match URL if it's a valid language
    locals.lang = lang;

    return {
        lang
    };
};
