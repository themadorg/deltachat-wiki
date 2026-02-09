import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDoc, getPagination } from '$lib/docs';

export const load: PageLoad = async ({ params, parent }) => {
    const { lang } = await parent();

    const doc = await getDoc(params.path, lang);

    if (doc) {
        const pagination = await getPagination(params.path, lang);
        return {
            ...doc,
            pagination
        };
    }

    throw error(404, 'Page not found');
};
