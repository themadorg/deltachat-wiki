import type { PageLoad } from './$types';
import { fetchDocs } from '$lib/docs';

export const load: PageLoad = async ({ parent }) => {
    const { lang } = await parent();
    const docs = await fetchDocs(lang);

    return {
        docs,
        lang
    };
};
