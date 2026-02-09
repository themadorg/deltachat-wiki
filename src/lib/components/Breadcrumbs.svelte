<script lang="ts">
    import { page } from "$app/state";
    import { getI18n } from "$lib/i18n.svelte";
    import { ChevronRight } from "@lucide/svelte";

    const i18n = getI18n();
    let currentSlug = $derived(page.params.path);

    let items = $derived.by(() => {
        if (!currentSlug) return [];
        const parts = currentSlug.split("/");
        const result = [];

        // First part: Section
        result.push({
            label: i18n.t(`subnav_${parts[0]}`) || parts[0],
            key: parts[0],
        });

        // Second part: Category (if exists)
        if (parts.length > 2) {
            result.push({
                label: i18n.t(`sidebar_cat_${parts[1]}`) || parts[1],
                key: parts[1],
            });
        }

        return result;
    });
</script>

{#if items.length > 0}
    <nav class="breadcrumbs-container" aria-label="Breadcrumb">
        {#each items as item, i}
            {#if i > 0}
                <div class="breadcrumb-separator">
                    <ChevronRight size={12} />
                </div>
            {/if}
            <span class="breadcrumb-label">
                {item.label}
            </span>
        {/each}
    </nav>
{/if}

<style>
    .breadcrumbs-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
        color: var(--text-muted);
        letter-spacing: 0.01em;
    }

    .breadcrumb-label {
        font-weight: 500;
        transition: color 0.2s;
    }

    .breadcrumb-separator {
        opacity: 0.4;
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    :global([dir="rtl"]) .breadcrumb-separator {
        transform: rotate(180deg);
    }
</style>
