<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import { ExternalLink, Info, RotateCcw, Download, Upload } from "@lucide/svelte";
    import { getI18n } from "$lib/i18n.svelte";
    import ChecklistScoreRing from "$lib/components/ChecklistScoreRing.svelte";
    import ChecklistInfoModal from "$lib/components/ChecklistInfoModal.svelte";
    import {
        calculateScore,
        calculateEssentialScore,
        calculateSectionScore,
        CHECKLIST_STORAGE_PREFIX,
        exportChecklistProgress,
        importChecklistProgress,
        getEssentialItemIds,
        getRatingKey,
        type ChecklistDefinition,
        type ChecklistItem
    } from "$lib/checklists/load";

    let { checklist }: { checklist: ChecklistDefinition } = $props();

    const i18n = getI18n();

    let checked = $state<Set<string>>(new Set());
    let scorePanelEl = $state<HTMLElement | null>(null);
    let showFloatingGauge = $state(false);
    let infoModal = $state<ChecklistItem | null>(null);
    let importInputEl = $state<HTMLInputElement | null>(null);
    let importError = $state<string | null>(null);
    const overallScore = $derived(calculateScore(checklist, checked));
    const essentialScore = $derived(calculateEssentialScore(checklist, checked));
    const essentialTotal = $derived(getEssentialItemIds(checklist).length);
    const essentialCompleted = $derived(
        getEssentialItemIds(checklist).filter((id) => checked.has(id)).length
    );
    const ratingKey = $derived(getRatingKey(overallScore));

    const totalItems = $derived(
        checklist.sections.reduce((n, section) => n + section.items.length, 0)
    );

    function loadFromStorage() {
        if (!browser) return;
        const raw = localStorage.getItem(`${CHECKLIST_STORAGE_PREFIX}${checklist.id}`);
        if (!raw) {
            checked = new Set();
            return;
        }
        try {
            checked = new Set(JSON.parse(raw));
        } catch {
            checked = new Set();
        }
    }

    function saveToStorage(next: Set<string>) {
        if (!browser) return;
        localStorage.setItem(`${CHECKLIST_STORAGE_PREFIX}${checklist.id}`, JSON.stringify([...next]));
    }

    function toggleItem(itemId: string) {
        const next = new Set(checked);
        if (next.has(itemId)) {
            next.delete(itemId);
        } else {
            next.add(itemId);
        }
        checked = next;
        saveToStorage(next);
    }

    function resetChecklist() {
        checked = new Set();
        saveToStorage(checked);
    }

    function scrollToScore() {
        scorePanelEl?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function openInfo(item: ChecklistItem, event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (item.info) infoModal = item;
    }

    function closeInfo() {
        infoModal = null;
    }

    function exportProgress() {
        if (!browser) return;
        const yaml = exportChecklistProgress(checklist, checked);
        const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${checklist.id}-progress.yml`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function triggerImport() {
        importError = null;
        importInputEl?.click();
    }

    async function handleImportFile(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = "";
        if (!file || !browser) return;

        importError = null;
        const text = await file.text();
        const result = importChecklistProgress(checklist, text);
        if (!result.ok) {
            importError = i18n.t(`checklist_import_${result.error}`);
            return;
        }

        checked = result.checked;
        saveToStorage(checked);
    }

    onMount(() => {
        loadFromStorage();

        if (!scorePanelEl) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                showFloatingGauge = !entry.isIntersecting;
            },
            { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
        );

        observer.observe(scorePanelEl);
        return () => observer.disconnect();
    });
</script>

<div class="checklist">
    <div class="header-card">
        <div class="header-main" bind:this={scorePanelEl}>
            <div class="header-copy">
                <h2 class="checklist-title">{checklist.title}</h2>
                <p class="checklist-desc">{checklist.description}</p>
                <a
                    href={checklist.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="repo-link"
                >
                    {i18n.t("checklist_view_repo")}
                    <ExternalLink size={14} />
                </a>
            </div>
            <div class="score-ring-wrap">
                <ChecklistScoreRing score={overallScore} size={112} stroke={9} />
            </div>
        </div>

        <div class="header-stats">
            <div class="stat-card">
                <span class="stat-value">{i18n.t(ratingKey)}</span>
                <span class="stat-label">{i18n.t("checklist_score_desc")}</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">{checked.size}<span class="stat-denom">/{totalItems}</span></span>
                <span class="stat-label">{i18n.t("checklist_items_complete")}</span>
            </div>
            {#if essentialTotal > 0}
                <div class="stat-card essential">
                    <span class="stat-value">
                        {essentialCompleted}<span class="stat-denom">/{essentialTotal}</span>
                        <span class="stat-sub">{essentialScore}%</span>
                    </span>
                    <span class="stat-label">{i18n.t("checklist_essential_complete")}</span>
                </div>
            {/if}
        </div>

        <div class="header-actions">
            <input
                bind:this={importInputEl}
                type="file"
                accept=".yml,.yaml,text/yaml"
                class="import-input"
                onchange={handleImportFile}
            />
            <button type="button" class="action-btn" onclick={triggerImport}>
                <Upload size={13} />
                {i18n.t("checklist_import")}
            </button>
            <button type="button" class="action-btn" onclick={exportProgress}>
                <Download size={13} />
                {i18n.t("checklist_export")}
            </button>
            <button type="button" class="action-btn danger" onclick={resetChecklist}>
                <RotateCcw size={13} />
                {i18n.t("checklist_reset")}
            </button>
            {#if importError}
                <span class="import-error">{importError}</span>
            {/if}
        </div>
    </div>

    <div class="sections">
        {#each checklist.sections as section (section.id)}
            {@const sectionScore = calculateSectionScore(section, checked)}
            {@const sectionCompleted = section.items.filter((item) => checked.has(item.id)).length}
            <section class="checklist-section">
                <div class="section-header">
                    <div class="section-info">
                        <h3 class="section-title">{section.title}</h3>
                        {#if section.description}
                            <p class="section-desc">{section.description}</p>
                        {/if}
                    </div>
                    <div class="section-score">
                        <span class="section-score-value">{sectionScore}%</span>
                        <span class="section-score-meta">
                            {sectionCompleted}/{section.items.length}
                        </span>
                    </div>
                </div>
                <div class="section-progress">
                    <div class="section-progress-fill" style="width: {sectionScore}%"></div>
                </div>
                <ul class="item-list">
                    {#each section.items as item (item.id)}
                        <li class="item">
                            <label class="item-label">
                                <input
                                    type="checkbox"
                                    checked={checked.has(item.id)}
                                    onchange={() => toggleItem(item.id)}
                                />
                                <span class="checkbox-visual"></span>
                                <span class="item-content">
                                    <span class="item-text">
                                        {item.label}
                                    </span>
                                    {#if item.description}
                                        <span class="item-desc">{item.description}</span>
                                    {/if}
                                </span>
                            </label>
                            <div class="item-actions">
                                <span class="item-action-slot">
                                    {#if item.href && !item.info}
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="item-action"
                                            aria-label={i18n.t("checklist_external_link")}
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    {/if}
                                </span>
                                <span class="item-action-slot">
                                    {#if item.info}
                                        <button
                                            type="button"
                                            class="item-action"
                                            class:essential={item.essential}
                                            title={item.essential ? i18n.t("checklist_essential") : undefined}
                                            aria-label={i18n.t("checklist_info")}
                                            onclick={(event) => openInfo(item, event)}
                                        >
                                            <Info size={14} />
                                        </button>
                                    {/if}
                                </span>
                            </div>
                        </li>
                    {/each}
                </ul>
            </section>
        {/each}
    </div>
</div>

<button
    type="button"
    class="floating-gauge"
    class:visible={showFloatingGauge}
    onclick={scrollToScore}
    aria-label="{overallScore}% — {i18n.t(ratingKey)}"
    title="{overallScore}% — {i18n.t(ratingKey)}"
>
    <ChecklistScoreRing score={overallScore} size={56} stroke={6} />
    {#if essentialTotal > 0}
        <span class="floating-essential">{essentialScore}%</span>
    {/if}
</button>

{#if infoModal?.info}
    <ChecklistInfoModal
        title={infoModal.label}
        infoSlug={infoModal.info}
        href={infoModal.href}
        onclose={closeInfo}
    />
{/if}

<style>
    .checklist {
        margin: 2rem 0 3rem;
    }

    .header-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 0;
        background: var(--bg);
        margin-bottom: 1.5rem;
        overflow: hidden;
    }

    :global([data-theme="light"]) .header-card {
        box-shadow: 0 4px 24px -10px rgba(0, 0, 0, 0.1);
    }

    .header-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1.5rem;
        padding: 1.5rem 1.75rem;
        background: rgba(var(--primary-rgb), 0.05);
        border-bottom: 1px solid var(--border);
        flex-wrap: wrap;
    }

    :global([data-theme="light"]) .header-main {
        background: rgba(var(--primary-rgb), 0.04);
    }

    .header-copy {
        flex: 1;
        min-width: 200px;
    }

    .score-ring-wrap {
        flex-shrink: 0;
    }

    .header-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0;
        border-bottom: 1px solid var(--border);
    }

    .stat-card {
        padding: 1rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        border-inline-end: 1px solid var(--border);
    }

    .stat-card:last-child {
        border-inline-end: none;
    }

    .stat-value {
        font-size: 1.05rem;
        font-weight: 800;
        color: var(--text);
        line-height: 1.2;
    }

    .stat-card:first-child .stat-value {
        color: var(--primary);
    }

    .stat-card.essential .stat-value {
        color: #22c55e;
    }

    .stat-denom {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
    }

    .stat-sub {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-muted);
        margin-inline-start: 0.35rem;
    }

    .stat-label {
        font-size: 0.75rem;
        color: var(--text-muted);
        line-height: 1.35;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.85rem 1.25rem;
        flex-wrap: wrap;
    }

    .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.35rem 0.65rem;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: rgba(var(--primary-rgb), 0.06);
        color: var(--text);
        font-size: 0.78rem;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .action-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
        background: rgba(var(--primary-rgb), 0.1);
    }

    .action-btn.danger:hover {
        border-color: #ef4444;
        color: #ef4444;
        background: rgba(239, 68, 68, 0.08);
    }

    .import-input {
        display: none;
    }

    .import-error {
        flex: 1 1 100%;
        font-size: 0.75rem;
        color: #ef4444;
        line-height: 1.35;
    }

    .checklist-title {
        font-size: 1.35rem;
        font-weight: 800;
        color: var(--text);
        margin: 0 0 0.35rem;
        border: none;
        padding: 0;
    }

    .checklist-desc {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.95rem;
    }

    .repo-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary);
        text-decoration: none;
        white-space: nowrap;
    }

    .repo-link:hover {
        text-decoration: underline;
    }

    .floating-gauge {
        position: fixed;
        bottom: 1.25rem;
        inset-inline-end: 1.25rem;
        z-index: 200;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        padding: 0.5rem;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: var(--bg-surface);
        backdrop-filter: blur(16px) saturate(180%);
        -webkit-backdrop-filter: blur(16px) saturate(180%);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.18);
        cursor: pointer;
        opacity: 0;
        transform: translateY(10px) scale(0.92);
        pointer-events: none;
        transition:
            opacity 0.25s ease,
            transform 0.25s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }

    :global([data-theme="light"]) .floating-gauge {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .floating-gauge.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
    }

    .floating-gauge:hover {
        border-color: var(--primary);
        box-shadow:
            0 6px 24px rgba(0, 0, 0, 0.22),
            0 0 0 3px var(--primary-glow);
    }

    .floating-essential {
        font-size: 0.6rem;
        font-weight: 700;
        color: var(--primary);
        line-height: 1;
    }

    .sections {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .checklist-section {
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 1.25rem 1.5rem;
        background: var(--bg);
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 0.75rem;
    }

    .section-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text);
        margin: 0 0 0.25rem;
        border: none;
        padding: 0;
    }

    .section-desc {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-muted);
    }

    .section-score {
        text-align: end;
        flex-shrink: 0;
    }

    .section-score-value {
        display: block;
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--primary);
    }

    .section-score-meta {
        font-size: 0.75rem;
        color: var(--text-muted);
    }

    .section-progress {
        height: 4px;
        border-radius: 999px;
        background: var(--border);
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .section-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: var(--primary);
        transition: width 0.4s ease;
    }

    .item-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 10px;
        transition: background 0.2s ease;
    }

    .item:hover {
        background: rgba(var(--primary-rgb), 0.04);
    }

    .item-label {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        flex: 1;
        padding: 0.5rem 0.25rem;
        cursor: pointer;
        min-width: 0;
        padding-inline-end: 0;
    }

    .item-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        flex-shrink: 0;
        width: 72px;
        margin-inline-end: 0.25rem;
    }

    .item-action-slot {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .item-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--text-muted);
        flex-shrink: 0;
        transition: all 0.2s ease;
        cursor: pointer;
        text-decoration: none;
    }

    .item-action:hover {
        background: rgba(var(--primary-rgb), 0.1);
        color: var(--primary);
    }

    .item-label input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }

    .checkbox-visual {
        width: 20px;
        height: 20px;
        border-radius: 6px;
        border: 2px solid var(--border);
        flex-shrink: 0;
        margin-top: 0.1rem;
        transition: all 0.2s ease;
        position: relative;
    }

    .item-label input:checked + .checkbox-visual {
        background: var(--primary);
        border-color: var(--primary);
    }

    .item-label input:checked + .checkbox-visual::after {
        content: "";
        position: absolute;
        left: 5px;
        top: 2px;
        width: 5px;
        height: 9px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    .item-label input:focus-visible + .checkbox-visual {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    .item-content {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        min-width: 0;
    }

    .item-text {
        font-size: 0.92rem;
        color: var(--text);
        line-height: 1.4;
    }

    .item-action.essential {
        color: #22c55e;
    }

    .item-action.essential:hover {
        background: rgba(34, 197, 94, 0.12);
        color: #22c55e;
    }

    .item-desc {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    @media (max-width: 640px) {
        .header-main {
            padding: 1.25rem;
        }

        .header-stats {
            grid-template-columns: 1fr;
        }

        .stat-card {
            border-inline-end: none;
            border-bottom: 1px solid var(--border);
        }

        .stat-card:last-child {
            border-bottom: none;
        }

        .header-actions {
            padding: 0.85rem 1rem;
        }

        .checklist-section {
            padding: 1rem;
        }
    }
</style>
