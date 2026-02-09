<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { getI18n } from "$lib/i18n.svelte";
    import {
        Search,
        FileText,
        ArrowRight,
        X,
        CornerDownLeft,
        ArrowUp,
        ArrowDown,
    } from "@lucide/svelte";

    let { show = $bindable(false) } = $props();

    const i18n = getI18n();

    interface SearchResult {
        title: string;
        slug: string;
        excerpt: string;
        section: string;
        score: number;
    }

    let query = $state("");
    let results = $state<SearchResult[]>([]);
    let activeIndex = $state(0);
    let inputEl = $state<HTMLInputElement | null>(null);
    let isLoading = $state(false);
    let docsIndex = $state<
        { title: string; slug: string; content: string; section: string }[]
    >([]);
    let indexReady = $state(false);

    // Build search index from markdown docs
    async function buildIndex() {
        if (indexReady) return;
        isLoading = true;

        try {
            const allDocsRaw = import.meta.glob("/src/docs/**/*.md", {
                query: "?raw",
                import: "default",
            });
            const allDocsMeta = import.meta.glob("/src/docs/**/*.md");

            const entries: typeof docsIndex = [];

            for (const [path, rawResolver] of Object.entries(allDocsRaw)) {
                // Only index current language, fallback to en
                const lang = i18n.lang;
                if (!path.includes(`/${lang}/`) && !path.includes(`/en/`))
                    continue;
                // Prefer current language; skip en if current lang version exists
                if (path.includes(`/en/`) && lang !== "en") {
                    const langPath = path.replace(`/en/`, `/${lang}/`);
                    if (allDocsRaw[langPath]) continue;
                }

                try {
                    const raw = (await rawResolver()) as string;
                    const metaResolver = allDocsMeta[path];
                    let title = "";
                    let section = "";

                    if (metaResolver) {
                        const mod = (await metaResolver()) as any;
                        title = mod.metadata?.title || "";
                    }

                    // Extract slug
                    const parts = path.split("/");
                    const langInPath = path.includes(`/${lang}/`) ? lang : "en";
                    const langIndex = parts.indexOf(langInPath);
                    const slugParts = parts.slice(langIndex + 1);
                    const slug = slugParts.join("/").replace(".md", "");

                    // Determine section from path
                    const sectionParts = slug.split("/");
                    section = sectionParts[0] || "";

                    // Strip frontmatter and markdown syntax for plain text
                    let content = raw
                        .replace(/^---[\s\S]*?---/m, "") // frontmatter
                        .replace(/<script[\s\S]*?<\/script>/g, "") // script tags
                        .replace(/<[^>]+>/g, "") // HTML tags
                        .replace(/```[\s\S]*?```/g, "") // code blocks
                        .replace(/`[^`]+`/g, "") // inline code
                        .replace(/[#*_\[\]\(\)!>\-|]/g, " ") // markdown syntax
                        .replace(/\s+/g, " ")
                        .trim();

                    if (!title) {
                        // Try to extract from first heading
                        const headingMatch = raw.match(/^#\s+(.+)$/m);
                        title = headingMatch
                            ? headingMatch[1]
                            : slug.split("/").pop() || slug;
                    }

                    entries.push({ title, slug, content, section });
                } catch (e) {
                    // Skip unresolvable docs
                }
            }

            docsIndex = entries;
            indexReady = true;
        } catch (e) {
            console.error("Failed to build search index:", e);
        }

        isLoading = false;
    }

    // Search logic
    function performSearch(q: string) {
        if (!q.trim() || !indexReady) {
            results = [];
            return;
        }

        const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
        const scored: SearchResult[] = [];

        for (const doc of docsIndex) {
            const titleLower = doc.title.toLowerCase();
            const contentLower = doc.content.toLowerCase();
            let score = 0;

            for (const term of terms) {
                // Title match (weighted heavily)
                if (titleLower.includes(term)) {
                    score += 10;
                    if (titleLower.startsWith(term)) score += 5;
                    if (titleLower === term) score += 10;
                }

                // Content match
                const contentMatches = contentLower.split(term).length - 1;
                score += Math.min(contentMatches, 5); // Cap to prevent spam
            }

            if (score > 0) {
                // Generate excerpt around the first match
                let excerpt = "";
                const firstTerm = terms[0];
                const idx = contentLower.indexOf(firstTerm);
                if (idx !== -1) {
                    const start = Math.max(0, idx - 60);
                    const end = Math.min(
                        doc.content.length,
                        idx + firstTerm.length + 100,
                    );
                    excerpt =
                        (start > 0 ? "…" : "") +
                        doc.content.slice(start, end).trim() +
                        (end < doc.content.length ? "…" : "");
                } else {
                    excerpt = doc.content.slice(0, 150).trim() + "…";
                }

                scored.push({
                    title: doc.title,
                    slug: doc.slug,
                    excerpt,
                    section: doc.section,
                    score,
                });
            }
        }

        scored.sort((a, b) => b.score - a.score);
        results = scored.slice(0, 12);
        activeIndex = 0;
    }

    $effect(() => {
        performSearch(query);
    });

    $effect(() => {
        if (show) {
            buildIndex();
            // Focus input after modal opens
            setTimeout(() => inputEl?.focus(), 50);
        } else {
            query = "";
            results = [];
            activeIndex = 0;
        }
    });

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, results.length - 1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
        } else if (e.key === "Enter" && results[activeIndex]) {
            e.preventDefault();
            navigateTo(results[activeIndex]);
        } else if (e.key === "Escape") {
            show = false;
        }
    }

    function navigateTo(result: SearchResult) {
        show = false;
        goto(`/${i18n.lang}/docs/${result.slug}`);
    }

    function highlightMatch(text: string, q: string): string {
        if (!q.trim()) return text;
        const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
        let highlighted = text;
        for (const term of terms) {
            const regex = new RegExp(
                `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                "gi",
            );
            highlighted = highlighted.replace(regex, "<mark>$1</mark>");
        }
        return highlighted;
    }

    // Scroll active result into view
    $effect(() => {
        if (results.length > 0) {
            const el = document.querySelector(
                `.search-result-item[data-index="${activeIndex}"]`,
            );
            if (el) {
                el.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    });

    function sectionLabel(section: string): string {
        const map: Record<string, string> = {
            general: i18n.lang === "fa" ? "عمومی" : "General",
            webxdc: "Webxdc",
            bot: i18n.lang === "fa" ? "ربات" : "Bot",
            servers: i18n.lang === "fa" ? "سرورها" : "Servers",
        };
        return map[section] || section;
    }
</script>

{#if show}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="search-overlay"
        onclick={() => (show = false)}
        onkeydown={handleKeydown}
    >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class="search-modal" onclick={(e) => e.stopPropagation()}>
            <div class="search-input-container">
                <Search size={20} class="search-input-icon" />
                <input
                    bind:this={inputEl}
                    bind:value={query}
                    type="text"
                    class="search-input"
                    placeholder={i18n.lang === "fa"
                        ? "جستجو در مستندات..."
                        : "Search documentation..."}
                    onkeydown={handleKeydown}
                />
                <button class="search-close-btn" onclick={() => (show = false)}>
                    <X size={16} />
                </button>
            </div>

            <div class="search-results-container">
                {#if isLoading}
                    <div class="search-status">
                        <div class="search-spinner"></div>
                        <span
                            >{i18n.lang === "fa"
                                ? "ساخت نمایه جستجو..."
                                : "Building search index..."}</span
                        >
                    </div>
                {:else if query && results.length === 0}
                    <div class="search-status">
                        <span
                            >{i18n.lang === "fa"
                                ? "نتیجه‌ای یافت نشد."
                                : "No results found."}</span
                        >
                    </div>
                {:else if results.length > 0}
                    <ul class="search-results-list">
                        {#each results as result, idx}
                            <li>
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    class="search-result-item"
                                    class:active={idx === activeIndex}
                                    data-index={idx}
                                    onclick={() => navigateTo(result)}
                                    onmouseenter={() => (activeIndex = idx)}
                                >
                                    <div class="result-icon">
                                        <FileText size={18} />
                                    </div>
                                    <div class="result-body">
                                        <div class="result-header">
                                            <span class="result-title"
                                                >{@html highlightMatch(
                                                    result.title,
                                                    query,
                                                )}</span
                                            >
                                            <span class="result-section"
                                                >{sectionLabel(
                                                    result.section,
                                                )}</span
                                            >
                                        </div>
                                        <p class="result-excerpt">
                                            {@html highlightMatch(
                                                result.excerpt,
                                                query,
                                            )}
                                        </p>
                                    </div>
                                    <div class="result-action">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <div class="search-status search-hints">
                        <p>
                            {i18n.lang === "fa"
                                ? "شروع به تایپ کنید تا جستجو شود..."
                                : "Start typing to search..."}
                        </p>
                    </div>
                {/if}
            </div>

            <div class="search-footer">
                <div class="search-footer-hints">
                    <span class="hint"
                        ><CornerDownLeft size={12} />
                        {i18n.lang === "fa" ? "انتخاب" : "Select"}</span
                    >
                    <span class="hint"
                        ><ArrowUp size={12} /><ArrowDown size={12} />
                        {i18n.lang === "fa" ? "پیمایش" : "Navigate"}</span
                    >
                    <span class="hint"
                        ><kbd>Esc</kbd>
                        {i18n.lang === "fa" ? "بستن" : "Close"}</span
                    >
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .search-overlay {
        position: fixed;
        inset: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 12vh;
        animation: overlayFadeIn 0.15s ease-out;
    }

    @keyframes overlayFadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .search-modal {
        width: 100%;
        max-width: 640px;
        background: var(--bg-surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
        animation: modalSlideIn 0.2s cubic-bezier(0.23, 1, 0.32, 1);
        display: flex;
        flex-direction: column;
        max-height: 70vh;
    }

    :global([data-theme="light"]) .search-modal {
        background: #ffffff;
        box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-16px) scale(0.98);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Input */
    .search-input-container {
        display: flex;
        align-items: center;
        padding: 1rem 1.25rem;
        gap: 0.75rem;
        border-bottom: 1px solid var(--border);
    }

    :global(.search-input-icon) {
        color: var(--text-muted);
        flex-shrink: 0;
    }

    .search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text);
        font-size: 1.1rem;
        font-weight: 500;
        line-height: 1.5;
    }

    .search-input::placeholder {
        color: var(--text-muted);
        font-weight: 400;
    }

    .search-close-btn {
        background: rgba(120, 120, 120, 0.1);
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.35rem;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
    }

    .search-close-btn:hover {
        background: rgba(120, 120, 120, 0.2);
        color: var(--text);
    }

    /* Results */
    .search-results-container {
        overflow-y: auto;
        flex: 1;
        min-height: 100px;
    }

    .search-results-list {
        list-style: none;
        padding: 0.5rem;
        margin: 0;
    }

    .search-result-item {
        display: flex;
        align-items: flex-start;
        gap: 0.85rem;
        padding: 0.85rem 1rem;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.1s;
    }

    .search-result-item.active {
        background: rgba(var(--primary-rgb), 0.1);
    }

    :global([data-theme="light"]) .search-result-item.active {
        background: rgba(var(--primary-rgb), 0.07);
    }

    .result-icon {
        color: var(--text-muted);
        flex-shrink: 0;
        margin-top: 2px;
    }

    .search-result-item.active .result-icon {
        color: var(--primary);
    }

    .result-body {
        flex: 1;
        min-width: 0;
    }

    .result-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 0.25rem;
    }

    .result-title {
        font-size: 0.925rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .search-result-item.active .result-title {
        color: var(--primary);
    }

    .result-section {
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
        background: rgba(120, 120, 120, 0.08);
        padding: 0.1rem 0.45rem;
        border-radius: 4px;
        flex-shrink: 0;
    }

    .result-excerpt {
        font-size: 0.8rem;
        color: var(--text-muted);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;
    }

    :global(.result-excerpt mark),
    :global(.result-title mark) {
        background: rgba(var(--primary-rgb), 0.25);
        color: var(--primary);
        border-radius: 2px;
        padding: 0 2px;
    }

    :global([data-theme="light"] .result-excerpt mark),
    :global([data-theme="light"] .result-title mark) {
        background: rgba(var(--primary-rgb), 0.15);
    }

    .result-action {
        color: var(--text-muted);
        flex-shrink: 0;
        opacity: 0;
        transition: opacity 0.15s;
        margin-top: 2px;
    }

    .search-result-item.active .result-action {
        opacity: 1;
        color: var(--primary);
    }

    /* Status / Empty */
    .search-status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 2.5rem 1rem;
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .search-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Footer */
    .search-footer {
        border-top: 1px solid var(--border);
        padding: 0.65rem 1.25rem;
        background: rgba(120, 120, 120, 0.02);
    }

    .search-footer-hints {
        display: flex;
        gap: 1.25rem;
        justify-content: center;
    }

    .hint {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.7rem;
        color: var(--text-muted);
    }

    .hint kbd {
        background: rgba(120, 120, 120, 0.1);
        border: 1px solid var(--border);
        border-radius: 3px;
        padding: 0 4px;
        font-size: 0.65rem;
        font-family: inherit;
    }

    @media (max-width: 640px) {
        .search-modal {
            margin: 0 1rem;
            max-height: 80vh;
        }

        .search-overlay {
            padding-top: 5vh;
        }
    }
</style>
