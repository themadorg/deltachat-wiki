import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { getRfcContent, getRfcTitle, listRfcIds } from "$lib/rfcs";

export const prerender = true;

export function entries() {
    return listRfcIds().map((rfc) => ({ rfc }));
}

export const load: PageLoad = ({ params }) => {
    const rfc = params.rfc.replace(/\.txt$/, "");
    const content = getRfcContent(rfc);
    if (content == null) throw error(404, "RFC not found");

    return {
        rfc,
        title: getRfcTitle(rfc),
        content
    };
};
