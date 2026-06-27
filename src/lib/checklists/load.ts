import { parse, stringify } from "yaml";
import coreRaw from "./core.yml?raw";
import desktopRaw from "./desktop.yml?raw";
import mobileRaw from "./mobile.yml?raw";
import serverRaw from "./server.yml?raw";

export interface ChecklistItem {
    id: string;
    label: string;
    description?: string;
    href?: string;
    essential?: boolean;
    info?: string;
}

export interface ChecklistSection {
    id: string;
    title: string;
    description?: string;
    items: ChecklistItem[];
}

export interface ChecklistDefinition {
    id: ChecklistId;
    title: string;
    description: string;
    repoUrl: string;
    sections: ChecklistSection[];
}

export type ChecklistId = "core" | "desktop" | "mobile" | "server";

export const CHECKLIST_WIKI_REPO = "https://github.com/themadorg/deltachat-wiki";

export function getChecklistYamlUrl(id: ChecklistId) {
    return `${CHECKLIST_WIKI_REPO}/blob/main/src/lib/checklists/${id}.yml`;
}

export const CHECKLIST_STORAGE_PREFIX = "build-checklist:";

export const checklistEntries: {
    id: ChecklistId;
    slug: string;
    icon: string;
}[] = [
    { id: "core", slug: "building/core", icon: "Cpu" },
    { id: "desktop", slug: "building/desktop", icon: "Monitor" },
    { id: "mobile", slug: "building/mobile", icon: "Smartphone" },
    { id: "server", slug: "building/server", icon: "Server" }
];

interface ChecklistYaml {
    id: ChecklistId;
    title: string;
    description: string;
    repo_url: string;
    sections: ChecklistSection[];
}

const rawById: Record<ChecklistId, string> = {
    core: coreRaw,
    desktop: desktopRaw,
    mobile: mobileRaw,
    server: serverRaw
};

function parseChecklist(raw: string): ChecklistDefinition {
    const data = parse(raw) as ChecklistYaml;
    return {
        id: data.id,
        title: data.title,
        description: data.description,
        repoUrl: data.repo_url,
        sections: data.sections
    };
}

export function loadChecklist(id: ChecklistId): ChecklistDefinition {
    return parseChecklist(rawById[id]);
}

const infoModules = import.meta.glob("/src/lib/checklists/info/**/*.md");

export async function loadChecklistInfo(slug: string) {
    const path = `/src/lib/checklists/info/${slug}.md`;
    const loader = infoModules[path];
    if (!loader) return null;
    const mod = (await loader()) as { default: unknown };
    return mod.default;
}

export function getAllItemIds(checklist: ChecklistDefinition) {
    return checklist.sections.flatMap((section) => section.items.map((item) => item.id));
}

export function getEssentialItemIds(checklist: ChecklistDefinition) {
    return checklist.sections.flatMap((section) =>
        section.items.filter((item) => item.essential).map((item) => item.id)
    );
}

export function calculateScore(checklist: ChecklistDefinition, checked: Set<string>) {
    const allIds = getAllItemIds(checklist);
    if (allIds.length === 0) return 0;
    const completed = allIds.filter((id) => checked.has(id)).length;
    return Math.round((completed / allIds.length) * 100);
}

export function calculateEssentialScore(checklist: ChecklistDefinition, checked: Set<string>) {
    const essentialIds = getEssentialItemIds(checklist);
    if (essentialIds.length === 0) return 0;
    const completed = essentialIds.filter((id) => checked.has(id)).length;
    return Math.round((completed / essentialIds.length) * 100);
}

export function calculateSectionScore(section: ChecklistSection, checked: Set<string>) {
    if (section.items.length === 0) return 0;
    const completed = section.items.filter((item) => checked.has(item.id)).length;
    return Math.round((completed / section.items.length) * 100);
}

export function getRatingKey(score: number) {
    if (score === 100) return "checklist_rating_ready";
    if (score >= 76) return "checklist_rating_nearly";
    if (score >= 51) return "checklist_rating_progress";
    if (score >= 26) return "checklist_rating_getting";
    return "checklist_rating_starting";
}

export function exportChecklistProgress(checklist: ChecklistDefinition, checked: Set<string>) {
    const overallScore = calculateScore(checklist, checked);
    const essentialScore = calculateEssentialScore(checklist, checked);
    const essentialIds = getEssentialItemIds(checklist);
    const totalItems = getAllItemIds(checklist).length;

    return stringify(
        {
            checklist: checklist.id,
            title: checklist.title,
            exported_at: new Date().toISOString(),
            scores: {
                overall: overallScore,
                essential: essentialScore,
                rating: getRatingKey(overallScore)
            },
            progress: {
                completed: checked.size,
                total: totalItems,
                essential_completed: essentialIds.filter((id) => checked.has(id)).length,
                essential_total: essentialIds.length
            },
            checked: [...checked].sort(),
            sections: checklist.sections.map((section) => ({
                id: section.id,
                title: section.title,
                completed: section.items.filter((item) => checked.has(item.id)).length,
                total: section.items.length,
                items: section.items.map((item) => ({
                    id: item.id,
                    label: item.label,
                    completed: checked.has(item.id),
                    essential: !!item.essential
                }))
            }))
        },
        { lineWidth: 0 }
    );
}

export type ImportProgressError = "invalid_yaml" | "wrong_checklist" | "invalid_format";

export type ImportProgressResult =
    | { ok: true; checked: Set<string> }
    | { ok: false; error: ImportProgressError };

interface ImportedProgress {
    checklist?: string;
    checked?: unknown;
    sections?: {
        items?: { id?: string; completed?: boolean }[];
    }[];
}

export function importChecklistProgress(
    checklist: ChecklistDefinition,
    raw: string
): ImportProgressResult {
    let data: ImportedProgress;
    try {
        data = parse(raw) as ImportedProgress;
    } catch {
        return { ok: false, error: "invalid_yaml" };
    }

    if (data.checklist && data.checklist !== checklist.id) {
        return { ok: false, error: "wrong_checklist" };
    }

    const validIds = new Set(getAllItemIds(checklist));

    if (Array.isArray(data.checked)) {
        const checked = new Set(
            data.checked.filter((id): id is string => typeof id === "string" && validIds.has(id))
        );
        return { ok: true, checked };
    }

    if (Array.isArray(data.sections)) {
        const checked = new Set<string>();
        for (const section of data.sections) {
            if (!Array.isArray(section.items)) continue;
            for (const item of section.items) {
                if (item.completed && typeof item.id === "string" && validIds.has(item.id)) {
                    checked.add(item.id);
                }
            }
        }
        return { ok: true, checked };
    }

    return { ok: false, error: "invalid_format" };
}

export function loadCheckedFromStorage(id: ChecklistId): Set<string> {
    if (typeof localStorage === "undefined") return new Set();
    const raw = localStorage.getItem(`${CHECKLIST_STORAGE_PREFIX}${id}`);
    if (!raw) return new Set();
    try {
        return new Set(JSON.parse(raw));
    } catch {
        return new Set();
    }
}
