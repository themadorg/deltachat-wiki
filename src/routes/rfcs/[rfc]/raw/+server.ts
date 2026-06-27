import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getRfcContent, listRfcIds } from "$lib/rfcs";

export const prerender = true;

export function entries() {
    return listRfcIds().map((rfc) => ({ rfc }));
}

export const GET: RequestHandler = ({ params }) => {
    const content = getRfcContent(params.rfc);
    if (content == null) throw error(404, "RFC not found");

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400"
        }
    });
};
