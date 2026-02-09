#!/usr/bin/env node
/**
 * Build script to package the static site as a Webxdc (.xdc) file.
 * 
 * Webxdc constraints:
 *   - ZIP file with index.html at root
 *   - No internet access (fully isolated sandbox)
 *   - All assets must be local
 *   - manifest.toml + icon.png for metadata
 * 
 * SvelteKit challenges for webxdc:
 *   - Client-side router uses absolute paths like /en/docs/...
 *   - __data.json files needed for hydration  
 *   - trailingSlash='never' means /en -> en.html (not en/index.html)
 *   - localStorage might be restricted
 */

import { execSync } from 'child_process';
import { mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync, copyFileSync, statSync, rmSync } from 'fs';
import { join, relative, dirname } from 'path';

const ROOT = process.cwd();
const BUILD_DIR = join(ROOT, 'build');
const XDC_STAGE = join(ROOT, 'dist', '.xdc-stage');
const DIST_DIR = join(ROOT, 'dist');
const XDC_NAME = 'deltachat-wiki.xdc';

// Files to exclude from the .xdc
const EXCLUDE_PATTERNS = [
    /\.br$/,           // Brotli precompressed
    /\.gz$/,           // Gzip precompressed
    /robots\.txt$/,    // SEO only
    /sitemap\.xml$/,   // SEO only  
    /llms\.txt$/,      // AI crawler only
    /llms-full\.txt$/, // AI crawler only
    // NOTE: __data.json must NOT be excluded! SvelteKit needs them for hydration.
];

function shouldExclude(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function getAllFiles(dir, baseDir = dir) {
    const results = [];
    try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            if (entry.isDirectory()) {
                results.push(...getAllFiles(fullPath, baseDir));
            } else {
                const rel = relative(baseDir, fullPath);
                if (!shouldExclude(rel)) results.push(rel);
            }
        }
    } catch (e) { /* ignore */ }
    return results;
}

// ====== MAIN ======

if (!existsSync(BUILD_DIR)) {
    console.error('❌ Build directory not found. Run "bun run build" first.');
    process.exit(1);
}

console.log('📦 Preparing Webxdc package...\n');

// Clean staging
if (existsSync(XDC_STAGE)) rmSync(XDC_STAGE, { recursive: true, force: true });
mkdirSync(XDC_STAGE, { recursive: true });

// Copy build files to staging
const allBuildFiles = getAllFiles(BUILD_DIR);
for (const file of allBuildFiles) {
    const dst = join(XDC_STAGE, file);
    mkdirSync(dirname(dst), { recursive: true });
    copyFileSync(join(BUILD_DIR, file), dst);
}
console.log(`   📂 Copied ${allBuildFiles.length} files to staging`);

// Copy manifest.toml and icon.png
for (const f of ['manifest.toml', 'icon.png']) {
    const src = join(ROOT, f);
    if (existsSync(src)) {
        copyFileSync(src, join(XDC_STAGE, f));
        console.log(`   ✅ Added ${f}`);
    }
}

// Inject version into manifest.toml
const manifestPath = join(XDC_STAGE, 'manifest.toml');
if (existsSync(manifestPath)) {
    let version = '0.0.0';
    // Prefer .version file (written by semantic-release in CI)
    const versionFile = join(ROOT, '.version');
    if (existsSync(versionFile)) {
        version = readFileSync(versionFile, 'utf-8').trim();
    } else {
        // Fall back to package.json version
        const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
        version = pkg.version || '0.0.0';
    }
    let manifest = readFileSync(manifestPath, 'utf-8');
    manifest = manifest.replace(
        /^name\s*=\s*"(.+?)"/m,
        `name = "$1 v${version}"`
    );
    writeFileSync(manifestPath, manifest);
    console.log(`   📌 Version injected: v${version}`);
}

// ===== FIX 1: Replace root index.html =====
// The original does a meta refresh to /fa which is an absolute path.
// In webxdc, we need to redirect to the flat file: en.html or fa.html
console.log('\n🔧 Fix 1: Creating webxdc-compatible root index.html...');

const rootHtml = `<!doctype html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Delta Chat Guide</title>
    <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; 
               height: 100vh; font-family: system-ui, sans-serif; background: #0b101b; color: #94a3b8; }
    </style>
    <script>
        (function() {
            var lang = 'en';
            try {
                var saved = localStorage.getItem('lang');
                if (saved === 'fa' || saved === 'en') lang = saved;
                else {
                    var nav = (navigator.language || '').toLowerCase();
                    if (nav.startsWith('fa')) lang = 'fa';
                }
            } catch(e) {
                var nav = (navigator.language || '').toLowerCase();
                if (nav.startsWith('fa')) lang = 'fa';
            }
            // SvelteKit with trailingSlash='never' creates en.html, fa.html
            window.location.replace(lang + '.html');
        })();
    </script>
    <noscript>
        <meta http-equiv="refresh" content="0; url=en.html" />
    </noscript>
</head>
<body>
    <p>Loading...</p>
</body>
</html>`;

writeFileSync(join(XDC_STAGE, 'index.html'), rootHtml);
console.log('   ✅ Root index.html redirects to {lang}.html');

// ===== FIX 2: Fix absolute paths in HTML <head> =====
// SvelteKit already uses relative paths for assets (../../../_app/...)
// But some refs like href="/favicon.png" are absolute. Fix those.
console.log('\n🔧 Fix 2: Fixing absolute paths in HTML files...');

let htmlFixed = 0;
for (const file of getAllFiles(XDC_STAGE)) {
    if (!file.endsWith('.html') || file === 'index.html') continue;

    const filePath = join(XDC_STAGE, file);
    let content = readFileSync(filePath, 'utf-8');

    // Calculate relative path to root from this file's directory
    const depth = file.split('/').length - 1;
    const toRoot = depth > 0 ? '../'.repeat(depth) : './';

    // Fix href="/favicon.png" → href="../../favicon.png"
    content = content.replace(/href="\/favicon\.png"/g, `href="${toRoot}favicon.png"`);

    // Fix meta refresh with absolute urls (if any)
    content = content.replace(/content="(\d+);\s*url=\/([^"]+)"/g, (m, t, p) => `content="${t}; url=${toRoot}${p}"`);

    writeFileSync(filePath, content);
    htmlFixed++;
}
console.log(`   ✅ Fixed ${htmlFixed} HTML files`);

// ===== FIX 3: Wrap localStorage in try/catch =====
// The theme detection script in <head> uses localStorage which may throw in webxdc
console.log('\n🔧 Fix 3: Making localStorage access safe...');

let lsFixed = 0;
for (const file of getAllFiles(XDC_STAGE)) {
    if (!file.endsWith('.html') || file === 'index.html') continue;

    const filePath = join(XDC_STAGE, file);
    let content = readFileSync(filePath, 'utf-8');

    // Replace the raw localStorage access with try/catch
    const unsafeScript = `const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');`;
    const safeScript = `var theme; try { theme = localStorage.getItem('theme'); } catch(e) {} theme = theme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');`;

    if (content.includes(unsafeScript)) {
        content = content.replace(unsafeScript, safeScript);
        lsFixed++;
    }

    writeFileSync(filePath, content);
}
console.log(`   ✅ Fixed localStorage in ${lsFixed} files`);

// ===== FIX 4: Inject webxdc flag =====
// Sets window.__WEBXDC__ = true so the app knows it's running inside webxdc.
// This enables external link interception (see src/lib/webxdc.svelte.ts).
console.log('\n🔧 Fix 4: Injecting webxdc detection flag...');

let flagInjected = 0;
for (const file of getAllFiles(XDC_STAGE)) {
    if (!file.endsWith('.html')) continue;

    const filePath = join(XDC_STAGE, file);
    let content = readFileSync(filePath, 'utf-8');

    // Inject right after <head> or as first script
    if (content.includes('<head>') && !content.includes('__WEBXDC__')) {
        content = content.replace('<head>', '<head><script>window.__WEBXDC__=true</script>');
        writeFileSync(filePath, content);
        flagInjected++;
    }
}
console.log(`   ✅ Injected __WEBXDC__ flag in ${flagInjected} HTML files`);

// ===== CREATE ZIP =====
console.log('\n📦 Creating .xdc file...');

const xdcPath = join(DIST_DIR, XDC_NAME);
if (existsSync(xdcPath)) rmSync(xdcPath);

const fileList = getAllFiles(XDC_STAGE);
const fileListPath = join(DIST_DIR, '.xdc-files.txt');
writeFileSync(fileListPath, fileList.join('\n'));

console.log(`   ${fileList.length} files total`);

try {
    execSync(`cd "${XDC_STAGE}" && zip -9 -@ "${xdcPath}" < "${fileListPath}"`, { stdio: 'pipe' });
    rmSync(fileListPath, { force: true });
    rmSync(XDC_STAGE, { recursive: true, force: true });

    const sizeMB = (statSync(xdcPath).size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ Webxdc built successfully!`);
    console.log(`   📄 ${xdcPath}`);
    console.log(`   📏 ${sizeMB} MB`);
    console.log(`\n   Test: npx @webxdc/webxdc-dev run ${xdcPath}`);
    console.log(`   Send this .xdc file in Delta Chat to use it as offline documentation.`);
} catch (err) {
    console.error('❌ Failed:', err.message);
    rmSync(XDC_STAGE, { recursive: true, force: true });
    rmSync(fileListPath, { force: true });
    process.exit(1);
}
