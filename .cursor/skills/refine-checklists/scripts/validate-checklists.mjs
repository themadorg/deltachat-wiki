import { parse } from "yaml";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

const root = process.cwd();
const checklistsDir = join(root, "src/lib/checklists");
const infoDir = join(checklistsDir, "info");
const types = ["core", "desktop", "mobile", "server"];

let errors = 0;

function fail(message) {
    console.error(`ERROR: ${message}`);
    errors += 1;
}

function listMarkdownFiles(dir, base = dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
            out.push(...listMarkdownFiles(path, base));
        } else if (entry.endsWith(".md")) {
            out.push(relative(base, path).replace(/\.md$/, "").replace(/\\/g, "/"));
        }
    }
    return out;
}

const referencedInfo = new Set();

for (const type of types) {
    const yamlPath = join(checklistsDir, `${type}.yml`);
    if (!existsSync(yamlPath)) {
        fail(`Missing checklist YAML: ${yamlPath}`);
        continue;
    }

    let data;
    try {
        data = parse(readFileSync(yamlPath, "utf8"));
    } catch (error) {
        fail(`${type}.yml: ${error.message}`);
        continue;
    }

    if (data.id !== type) {
        fail(`${type}.yml: id must be "${type}", got "${data.id}"`);
    }

    const itemIds = new Set();

    for (const section of data.sections ?? []) {
        for (const item of section.items ?? []) {
            if (itemIds.has(item.id)) {
                fail(`${type}.yml: duplicate item id "${item.id}"`);
            }
            itemIds.add(item.id);

            if (!item.info) continue;

            referencedInfo.add(item.info);

            const infoPath = join(infoDir, `${item.info}.md`);
            if (!existsSync(infoPath)) {
                fail(`${type}.yml: info "${item.info}" has no file at src/lib/checklists/info/${item.info}.md`);
                continue;
            }

            const md = readFileSync(infoPath, "utf8");
            if (!md.includes("layout: checklist-info")) {
                fail(`info/${item.info}.md: missing "layout: checklist-info" frontmatter`);
            }
            if (!/^#\s+/m.test(md.replace(/^---[\s\S]*?---\n/, ""))) {
                fail(`info/${item.info}.md: missing "#" heading in body`);
            }
        }
    }
}

if (existsSync(infoDir)) {
    for (const slug of listMarkdownFiles(infoDir)) {
        if (!referencedInfo.has(slug)) {
            fail(`Orphan info markdown not referenced in YAML: info/${slug}.md`);
        }
    }
}

if (errors > 0) {
    console.error(`\n${errors} checklist validation error(s)`);
    process.exit(1);
}

console.log(`OK: ${types.length} checklists, ${referencedInfo.size} info pages validated`);
