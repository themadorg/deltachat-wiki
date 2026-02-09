<script lang="ts">
    import LucideIcon from "./LucideIcon.svelte";
    import { getI18n } from "$lib/i18n.svelte";

    let { title, description, icon, href, children } = $props();
    const i18n = getI18n();

    // Build the link: if href starts with "/" use as-is, otherwise assume it's a docs slug
    const resolvedHref = $derived(
        href?.startsWith("/") || href?.startsWith("http")
            ? href
            : href
              ? `/${i18n.lang}/docs/${href}`
              : undefined,
    );
</script>

{#if resolvedHref}
    <a class="tool-card" href={resolvedHref}>
        <div class="tool-card-inner">
            {#if icon}
                <div class="tool-icon">
                    {#if typeof icon === "string" && icon.length > 2}
                        <LucideIcon name={icon} size={28} />
                    {:else}
                        {icon}
                    {/if}
                </div>
            {/if}
            <h3 class="tool-title">{title}</h3>
            {#if description}
                <p class="tool-description">{description}</p>
            {/if}
            {#if children}
                <div class="tool-content">
                    {@render children?.()}
                </div>
            {/if}
        </div>
    </a>
{:else}
    <div class="tool-card">
        <div class="tool-card-inner">
            {#if icon}
                <div class="tool-icon">
                    {#if typeof icon === "string" && icon.length > 2}
                        <LucideIcon name={icon} size={28} />
                    {:else}
                        {icon}
                    {/if}
                </div>
            {/if}
            <h3 class="tool-title">{title}</h3>
            {#if description}
                <p class="tool-description">{description}</p>
            {/if}
            {#if children}
                <div class="tool-content">
                    {@render children?.()}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .tool-card {
        display: block;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border);
        border-radius: 16px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }

    :global([data-theme="light"]) .tool-card {
        background: #ffffff;
        border-color: rgba(0, 0, 0, 0.08);
        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.04);
    }

    .tool-card:hover {
        border-color: var(--primary);
        transform: translateY(-4px);
        box-shadow: 0 12px 32px -8px rgba(59, 130, 246, 0.15);
    }

    :global([data-theme="light"]) .tool-card:hover {
        border-color: var(--primary);
        box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.1);
    }

    .tool-card-inner {
        padding: 1.75rem 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .tool-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 14px;
        background: rgba(var(--primary-rgb), 0.1);
        color: var(--primary);
        margin-bottom: 1rem;
        transition: all 0.3s ease;
    }

    :global([data-theme="light"]) .tool-icon {
        background: rgba(var(--primary-rgb), 0.08);
    }

    .tool-card:hover .tool-icon {
        background: var(--primary);
        color: var(--primary-fg);
        transform: scale(1.1);
    }

    .tool-title {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text);
        letter-spacing: -0.01em;
        line-height: 1.3;
    }

    .tool-description {
        margin: 0.5rem 0 0;
        font-size: 0.9rem;
        line-height: 1.55;
        color: var(--text-muted);
    }

    .tool-content {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        line-height: 1.55;
        color: var(--text-muted);
    }
</style>
