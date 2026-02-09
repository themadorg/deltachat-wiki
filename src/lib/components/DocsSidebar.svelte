<script lang="ts">
    import { getI18n } from "$lib/i18n.svelte";
    import { getSidebarWithPath } from "$lib/docs";
    import { ChevronRight, ChevronDown, ArrowLeft } from "@lucide/svelte";
    import { slide } from "svelte/transition";

    interface SidebarItem {
        title: string;
        slug?: string;
        items?: SidebarItem[];
        drilldown?: boolean;
    }

    let {
        currentSlug = "",
        onNavigate = () => {},
    }: {
        currentSlug: string;
        onNavigate: () => void;
    } = $props();

    const i18n = getI18n();

    // --- State ---
    let sidebarConfig = $state<SidebarItem[] | null>(null);
    let configPath = $state<string>(""); // stable key: which config.ts was loaded
    let parentInfo = $state<{ name: string; path: string } | null>(null);
    let expandedGroups = $state<Record<string, boolean>>({});
    let animationDirection = $state<number>(0); // 0 = none, 1 = forward, -1 = back

    // --- Sidebar Config Resolution ---
    $effect(() => {
        const path = currentSlug || "general/introduction";
        getSidebarWithPath(path, i18n.lang).then((result) => {
            if (result) {
                // Only trigger animation if the config source actually changed
                const newPath = result.resolvedPath;
                if (newPath !== configPath && configPath !== "") {
                    // Determine direction: deeper = forward, shallower = back
                    animationDirection =
                        newPath.length > configPath.length ? 1 : -1;
                }
                configPath = newPath;
                sidebarConfig = result.config;
            }
        });
    });

    // --- Determine Parent for Back Button ---
    $effect(() => {
        if (!currentSlug || !configPath) {
            parentInfo = null;
            return;
        }

        const configParts = configPath.split("/");
        // Only show back button if the config is loaded from a deep path
        // e.g. "servers/madmail" or "servers/madmail/technical" but NOT "servers"
        if (configParts.length < 2) {
            parentInfo = null;
            return;
        }

        // Parent is one level up from the current config path
        const parentPath = configParts.slice(0, -1).join("/");
        // Label is the last part of the PARENT path (the destination name)
        const parentParts = parentPath.split("/");
        const parentLabel = parentParts[parentParts.length - 1];
        const parentName =
            parentLabel.charAt(0).toUpperCase() + parentLabel.slice(1);

        parentInfo = {
            name: parentName,
            path: parentPath,
        };
    });

    // --- Auto-expand groups containing the active page ---
    $effect(() => {
        if (!sidebarConfig || !currentSlug) return;

        function findAndExpand(items: SidebarItem[], slug: string): boolean {
            for (const item of items) {
                if (item.slug === slug) return true;
                if (item.items) {
                    if (findAndExpand(item.items, slug)) {
                        expandedGroups[item.title] = true;
                        return true;
                    }
                }
            }
            return false;
        }

        findAndExpand(sidebarConfig, currentSlug);
    });

    function toggleGroup(title: string) {
        expandedGroups[title] = !expandedGroups[title];
    }

    // Compute fly-in pixels based on animation direction
    let flyX = $derived.by(() => {
        const isRtl = i18n.dir === "rtl";
        const base = 40 * animationDirection;
        return isRtl ? -base : base;
    });
</script>

<nav class="sidebar-nav" aria-label="Documentation navigation">
    {#key configPath}
        <div
            class="sidebar-panel"
            class:animate={animationDirection !== 0}
            style="--fly-x: {flyX}px"
        >
            {#if parentInfo}
                <a
                    href="/{i18n.lang}/docs/{parentInfo.path}/overview"
                    class="back-button"
                    onclick={() => {
                        animationDirection = -1;
                        onNavigate();
                    }}
                >
                    <ArrowLeft size={15} />
                    <span>{parentInfo.name}</span>
                </a>
            {/if}

            {#if sidebarConfig}
                <div class="sidebar-items">
                    {#each sidebarConfig as item}
                        {#snippet renderItem(node: SidebarItem, depth: number)}
                            {#if node.items}
                                <!-- GROUP HEADER (recursive) -->
                                <div
                                    class="sidebar-group"
                                    style="--depth: {depth}"
                                >
                                    <div class="group-header-row">
                                        {#if node.slug}
                                            <a
                                                href="/{i18n.lang}/docs/{node.slug}"
                                                class="group-header-link"
                                                class:active={currentSlug ===
                                                    node.slug}
                                                onclick={() => onNavigate()}
                                            >
                                                <span class="group-title"
                                                    >{node.title}</span
                                                >
                                            </a>
                                        {:else}
                                            <button
                                                class="group-header-btn"
                                                onclick={() =>
                                                    toggleGroup(node.title)}
                                            >
                                                <span class="group-title"
                                                    >{node.title}</span
                                                >
                                            </button>
                                        {/if}

                                        {#if node.items.length > 0}
                                            <button
                                                class="group-chevron"
                                                class:expanded={expandedGroups[
                                                    node.title
                                                ]}
                                                onclick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleGroup(node.title);
                                                }}
                                                aria-label="Toggle {node.title}"
                                            >
                                                <ChevronDown size={14} />
                                            </button>
                                        {/if}
                                    </div>

                                    {#if expandedGroups[node.title]}
                                        <ul
                                            class="group-children"
                                            transition:slide={{ duration: 150 }}
                                        >
                                            {#each node.items as child}
                                                <li>
                                                    {@render renderItem(
                                                        child,
                                                        depth + 1,
                                                    )}
                                                </li>
                                            {/each}
                                        </ul>
                                    {/if}
                                </div>
                            {:else if node.drilldown}
                                <!-- DRILL-DOWN ENTRY -->
                                <a
                                    href="/{i18n.lang}/docs/{node.slug}"
                                    class="sidebar-link drilldown"
                                    class:active={currentSlug === node.slug}
                                    style="--depth: {depth}"
                                    onclick={() => {
                                        animationDirection = 1;
                                        onNavigate();
                                    }}
                                >
                                    <span>{node.title}</span>
                                    <ChevronRight
                                        size={14}
                                        class="drilldown-chevron"
                                    />
                                </a>
                            {:else}
                                <!-- NORMAL LINK -->
                                <a
                                    href="/{i18n.lang}/docs/{node.slug}"
                                    class="sidebar-link"
                                    class:active={currentSlug === node.slug}
                                    style="--depth: {depth}"
                                    onclick={() => onNavigate()}
                                >
                                    <span>{node.title}</span>
                                </a>
                            {/if}
                        {/snippet}

                        {@render renderItem(item, 0)}
                    {/each}
                </div>
            {/if}
        </div>
    {/key}
</nav>

<style>
    .sidebar-nav {
        position: relative;
        overflow: hidden;
    }

    /* --- Panel Transition (ONLY when switching config) --- */
    .sidebar-panel.animate {
        animation: panel-in 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes panel-in {
        from {
            opacity: 0;
            transform: translateX(var(--fly-x));
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* --- Back Button --- */
    .back-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        margin-bottom: 1rem;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.8125rem;
        font-weight: 600;
        border-radius: 6px;
        transition: all 0.15s;
        background: rgba(120, 120, 120, 0.05);
        border: 1px solid var(--border);
    }

    .back-button:hover {
        color: var(--text);
        background: rgba(120, 120, 120, 0.1);
        border-color: var(--primary);
    }

    :global([dir="rtl"]) .back-button :global(svg) {
        transform: rotate(180deg);
    }

    /* --- Sidebar Group --- */
    .sidebar-group {
        margin-bottom: 0.25rem;
    }

    .group-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.125rem;
    }

    .group-header-btn,
    .group-header-link {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0.375rem 0.5rem;
        padding-inline-start: calc(0.5rem + var(--depth, 0) * 0.75rem);
        border: none;
        background: none;
        color: var(--text-muted);
        font-size: 0.8125rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        text-decoration: none;
        text-align: start;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.15s;
    }

    .group-header-btn:hover,
    .group-header-link:hover {
        color: var(--text);
        background: rgba(120, 120, 120, 0.05);
    }

    .group-header-link.active {
        color: var(--primary);
        background: rgba(var(--primary-rgb, 59, 130, 246), 0.08);
    }

    .group-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .group-chevron {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        padding: 0;
        color: var(--text-muted);
        background: transparent;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.15s;
        flex-shrink: 0;
    }

    .group-chevron:hover {
        background: rgba(120, 120, 120, 0.1);
        color: var(--text);
    }

    .group-chevron:not(.expanded) {
        transform: rotate(-90deg);
    }

    :global([dir="rtl"]) .group-chevron:not(.expanded) {
        transform: rotate(90deg);
    }

    .group-children {
        list-style: none;
        padding: 0;
        margin: 0.125rem 0 0.375rem 0;
    }

    .group-children li {
        margin: 0;
        padding: 0;
    }

    /* --- Sidebar Links --- */
    .sidebar-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.3rem 0.75rem;
        padding-inline-start: calc(1.5rem + var(--depth, 0) * 0.75rem);
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.875rem;
        border-inline-start: 2px solid transparent;
        border-radius: 0 4px 4px 0;
        transition: all 0.15s;
    }

    :global([dir="rtl"]) .sidebar-link {
        border-radius: 4px 0 0 4px;
    }

    .sidebar-link:hover {
        color: var(--text);
        background: rgba(120, 120, 120, 0.05);
    }

    .sidebar-link.active {
        color: var(--primary);
        background: rgba(var(--primary-rgb, 59, 130, 246), 0.1);
        font-weight: 600;
        border-inline-start-color: var(--primary);
    }

    /* --- Drilldown specific --- */
    .sidebar-link.drilldown :global(.drilldown-chevron) {
        opacity: 0.4;
        transition: transform 0.15s;
        flex-shrink: 0;
    }

    .sidebar-link.drilldown:hover :global(.drilldown-chevron) {
        opacity: 0.8;
        transform: translateX(2px);
    }

    :global([dir="rtl"]) .sidebar-link.drilldown :global(.drilldown-chevron) {
        transform: rotate(180deg);
    }

    :global([dir="rtl"])
        .sidebar-link.drilldown:hover
        :global(.drilldown-chevron) {
        transform: rotate(180deg) translateX(2px);
    }
</style>
