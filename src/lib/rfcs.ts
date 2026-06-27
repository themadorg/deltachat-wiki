const rawFiles = import.meta.glob("/static/rfcs/*.txt", {
    query: "?raw",
    import: "default",
    eager: true
}) as Record<string, string>;

function idFromPath(filePath: string): string {
    return filePath.split("/").pop()!.replace(/\.txt$/, "");
}

export function listRfcIds(): string[] {
    return Object.keys(rawFiles).map(idFromPath).sort();
}

export function getRfcContent(id: string): string | null {
    return rawFiles[`/static/rfcs/${id}.txt`] ?? null;
}

export function getRfcTitle(id: string): string {
    const match = /^rfc(\d+)$/i.exec(id);
    if (match) return `RFC ${match[1]}`;
    return id;
}
