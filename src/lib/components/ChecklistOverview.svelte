<script lang="ts">
    import { ArrowRight } from "@lucide/svelte";
    import { getI18n } from "$lib/i18n.svelte";
    import LucideIcon from "$lib/components/LucideIcon.svelte";
    import {
        checklistEntries,
        getAllItemIds,
        getEssentialItemIds,
        loadChecklist
    } from "$lib/checklists/load";

    const i18n = getI18n();

    const entries = checklistEntries.map(({ id, slug, icon }) => {
        const checklist = loadChecklist(id);
        const total = getAllItemIds(checklist).length;
        const essentialTotal = getEssentialItemIds(checklist).length;

        return {
            id,
            slug,
            icon,
            title: checklist.title,
            description: checklist.description,
            total,
            essentialTotal
        };
    });
</script>

<div class="overview-cards">
    {#each entries as entry (entry.id)}
        <a class="info-card" href="/{i18n.lang}/docs/{entry.slug}">
            <div class="info-icon">
                <LucideIcon name={entry.icon} size={22} />
            </div>
            <div class="info-body">
                <h3 class="info-title">{entry.title}</h3>
                <p class="info-desc">{entry.description}</p>
                <div class="info-meta">
                    <span>{entry.total} {i18n.t("checklist_overview_items")}</span>
                    {#if entry.essentialTotal > 0}
                        <span class="essential-meta">
                            {entry.essentialTotal} {i18n.t("checklist_overview_essential")}
                        </span>
                    {/if}
                </div>
            </div>
            <span class="info-link">
                {i18n.t("checklist_open")}
                <ArrowRight size={14} />
            </span>
        </a>
    {/each}
</div>

<style>
    .overview-cards {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 1rem;
        margin: 2rem 0;
    }

    @media (min-width: 640px) {
        .overview-cards {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .info-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.5rem;
        border: 1px solid var(--border);
        border-radius: 18px;
        background: rgba(var(--primary-rgb), 0.03);
        text-decoration: none;
        color: inherit;
        transition: all 0.25s ease;
    }

    :global([data-theme="light"]) .info-card {
        background: #fff;
        box-shadow: 0 2px 12px -4px rgba(0, 0, 0, 0.06);
    }

    .info-card:hover {
        border-color: var(--primary);
        transform: translateY(-3px);
        box-shadow: 0 12px 32px -10px rgba(var(--primary-rgb), 0.2);
    }

    .info-icon {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: rgba(var(--primary-rgb), 0.12);
        color: var(--primary);
    }

    .info-body {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        min-width: 0;
    }

    .info-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--text);
        border: none;
        padding: 0;
    }

    .info-desc {
        margin: 0;
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--text-muted);
    }

    .info-meta {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        margin-top: 0.25rem;
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .essential-meta {
        color: var(--primary);
        font-weight: 600;
    }

    .info-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        margin-top: auto;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary);
    }

    .info-card:hover .info-link {
        gap: 0.55rem;
    }
</style>
