<script lang="ts">
    import { page } from "$app/state";
    import { getI18n } from "$lib/i18n.svelte";
    import {
        Languages,
        Search,
        Menu,
        X,
        Github,
        Sun,
        Moon,
    } from "@lucide/svelte";
    import LanguageModal from "$lib/components/modals/LanguageModal.svelte";
    import SearchModal from "$lib/components/SearchModal.svelte";
    import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
    import CopyActions from "$lib/components/CopyActions.svelte";
    import DocsSidebar from "$lib/components/DocsSidebar.svelte";
    import { theme } from "$lib/theme.svelte";
    import { onMount } from "svelte";
    import { config } from "../../../config";
    import Logo from "$lib/components/Logo.svelte";

    let { children } = $props();
    const i18n = getI18n();

    let showLangModal = $state(false);
    let showSearch = $state(false);
    let isMobileSidebarOpen = $state(false);

    onMount(() => {
        // Global Ctrl+K / Cmd+K shortcut to open search
        function handleGlobalKeydown(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                showSearch = true;
            }
        }
        document.addEventListener("keydown", handleGlobalKeydown);
        return () =>
            document.removeEventListener("keydown", handleGlobalKeydown);
    });

    let currentSlug = $derived(page.params.path);

    let headings = $state<{ id: string; html: string; level: number }[]>([]);
    let activeHeadingId = $state("");

    $effect(() => {
        if (currentSlug) {
            // Scroll the main page to the top on navigation
            window.scrollTo(0, 0);

            // Scroll the sidebar to show the active link, without affecting the main window
            setTimeout(() => {
                const activeEl = document.querySelector(".sidebar-link.active");
                if (activeEl) {
                    const sidebarContainer = activeEl.closest(".docs-sidebar");
                    if (sidebarContainer) {
                        const elRect = activeEl.getBoundingClientRect();
                        const containerRect =
                            sidebarContainer.getBoundingClientRect();
                        const offsetTop =
                            elRect.top -
                            containerRect.top +
                            sidebarContainer.scrollTop;
                        const targetScroll =
                            offsetTop -
                            sidebarContainer.clientHeight / 2 +
                            activeEl.clientHeight / 2;
                        sidebarContainer.scrollTo({
                            top: Math.max(0, targetScroll),
                            behavior: "smooth",
                        });
                    }
                }
            }, 300);
        }
    });

    $effect(() => {
        const updateHeadings = () => {
            const prose = document.querySelector(".prose");
            if (!prose) return;

            const headingElements = Array.from(
                prose.querySelectorAll("h2, h3"),
            );
            headings = headingElements.map((el) => {
                let id = el.id;
                if (!id) {
                    // Better ID generation supporting Unicode and more characters
                    id =
                        el.textContent
                            ?.trim()
                            .toLowerCase()
                            .replace(/[^\p{L}\p{N}\s-]/gu, "")
                            .replace(/\s+/g, "-")
                            .replace(/--+/g, "-")
                            .replace(/^-+/, "")
                            .replace(/-+$/, "") || "";
                    el.id = id;
                }

                return {
                    id,
                    html: el.innerHTML || "",
                    level: parseInt(el.tagName[1]),
                };
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeHeadingId = entry.target.id;
                    }
                });
            },
            { rootMargin: "-10% 0px -80% 0px" },
        );

        // This effect runs whenever the pathname or language changes
        const path = page.url.pathname;
        const lang = i18n.lang;

        // Use a small timeout to let the content render
        const timer = setTimeout(() => {
            updateHeadings();
            document
                .querySelectorAll(".prose h2, .prose h3")
                .forEach((el) => observer.observe(el));
        }, 200);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    });
</script>

<svelte:head>
    <title>{i18n.t("site_title")}</title>
</svelte:head>

<div class="docs-professional-layout">
    <!-- Top Navigation -->
    <header class="docs-header">
        <div class="header-container">
            <div class="header-left">
                <button
                    class="mobile-menu-btn"
                    onclick={() => (isMobileSidebarOpen = !isMobileSidebarOpen)}
                >
                    {#if isMobileSidebarOpen}
                        <X size={24} />
                    {:else}
                        <Menu size={24} />
                    {/if}
                </button>

                <a href="/{i18n.lang}" class="logo">
                    <div class="logo-icon">
                        <Logo size={24} class="header-logo-img" />
                    </div>
                    <span class="logo-text">{i18n.t("brand_logo_text")}</span>
                </a>
            </div>

            <div class="header-center">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="search-bar" onclick={() => (showSearch = true)}>
                    <Search size={16} class="search-icon-svg" />
                    <span class="search-bar-placeholder"
                        >{i18n.t("search_placeholder")}</span
                    >
                    <span class="search-hint">Ctrl K</span>
                </div>
            </div>

            <div class="header-right">
                <div class="header-actions">
                    <button
                        class="action-btn"
                        onclick={() => theme.toggle()}
                        title={theme.current === "dark"
                            ? "Switch to Light Mode"
                            : "Switch to Dark Mode"}
                    >
                        {#if theme.current === "dark"}
                            <Sun size={20} />
                        {:else}
                            <Moon size={20} />
                        {/if}
                    </button>

                    <button
                        class="action-btn"
                        onclick={() => (showLangModal = true)}
                        title="Change Language"
                    >
                        <Languages size={20} />
                    </button>

                    <a
                        href={config.socials.github}
                        class="action-btn"
                        target="_blank"
                        title="GitHub"
                    >
                        <Github size={20} />
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Sub-navigation -->
    <nav class="docs-subnav">
        <div class="subnav-container">
            <a
                href="/{i18n.lang}/docs/general/introduction"
                class:active={currentSlug?.startsWith("general") ||
                    !currentSlug}
            >
                {i18n.t("subnav_general")}
            </a>
            <a
                href="/{i18n.lang}/docs/webxdc/overview"
                class:active={currentSlug?.startsWith("webxdc")}
                >{i18n.t("subnav_webxdc")}</a
            >
            <a
                href="/{i18n.lang}/docs/bot/overview"
                class:active={currentSlug?.startsWith("bot")}
                >{i18n.t("subnav_bot")}</a
            >
            <a
                href="/{i18n.lang}/docs/servers/overview"
                class:active={currentSlug?.startsWith("servers")}
                >{i18n.t("subnav_servers")}</a
            >
        </div>
    </nav>

    <div class="docs-container">
        <!-- Sidebar -->
        <aside class="docs-sidebar" class:open={isMobileSidebarOpen}>
            <DocsSidebar
                currentSlug={currentSlug || ""}
                onNavigate={() => (isMobileSidebarOpen = false)}
            />
        </aside>

        <!-- Main Content Area -->
        <main class="docs-main">
            <div class="content-wrapper">
                <div class="content-top-actions">
                    <Breadcrumbs />
                    <div class="page-actions">
                        <CopyActions />
                    </div>
                </div>
                {@render children()}
            </div>

            <!-- Table of Contents (Right Side) -->
            <aside class="docs-toc">
                {#if headings && headings.length > 0}
                    <div class="toc-container">
                        <h4 class="toc-title">{i18n.t("toc_title")}</h4>
                        <nav class="toc-nav">
                            <ul>
                                {#each headings as heading}
                                    <li class:depth-3={heading.level === 3}>
                                        <a
                                            href="#{heading.id}"
                                            class:active={activeHeadingId ===
                                                heading.id}
                                        >
                                            {@html heading.html}
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </nav>
                    </div>
                {/if}
            </aside>
        </main>
    </div>

    <LanguageModal bind:show={showLangModal} />
    <SearchModal bind:show={showSearch} />
</div>

<style>
    .docs-professional-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: var(--bg);
        overflow-x: clip;
    }

    /* Header */
    .docs-header {
        height: 64px;
        background: var(--bg-surface);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        align-items: center;
    }

    .header-container {
        width: 100%;
        max-width: 1600px;
        margin: 0 auto;
        padding: 0 1.5rem;
        display: grid;
        grid-template-columns: 240px 1fr 240px;
        align-items: center;
        gap: 1.5rem;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .mobile-menu-btn {
        display: none;
        background: none;
        border: none;
        color: var(--text);
        cursor: pointer;
        padding: 0.5rem;
        margin-inline-start: -0.5rem;
        border-radius: 8px;
        transition: background 0.2s;
    }

    .mobile-menu-btn:hover {
        background: rgba(120, 120, 120, 0.1);
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--text);
        font-weight: 700;
        font-size: 1.125rem;
    }

    .logo-icon {
        color: var(--primary);
        display: flex;
        align-items: center;
    }

    :global(.header-logo-img) {
        width: 24px;
        height: 24px;
        color: var(--primary);
    }

    .logo-text {
        white-space: nowrap;
    }

    .header-center {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .search-bar {
        display: flex;
        align-items: center;
        background: rgba(120, 120, 120, 0.05);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.35rem 0.75rem;
        gap: 0.75rem;
        flex-direction: row-reverse;
        width: 100%;
        max-width: 500px;
        transition: all 0.2s;
    }

    :global([data-theme="light"]) .search-bar {
        background: rgba(0, 0, 0, 0.03);
    }

    :global(.search-icon-svg) {
        color: var(--text-muted);
    }

    .search-bar-placeholder {
        flex: 1;
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    .search-hint {
        color: var(--text-muted);
        font-size: 0.75rem;
        background: rgba(120, 120, 120, 0.1);
        padding: 1px 4px;
        border-radius: 3px;
    }

    /* Right Nav */
    .header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 1rem;
    }

    .header-actions {
        display: flex;
        gap: 1rem;
        border-inline-start: 1px solid rgba(255, 255, 255, 0.1);
        padding-inline-start: 1rem;
    }

    .action-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        transition: color 0.2s;
    }

    .action-btn:hover {
        color: var(--text);
    }

    /* Sub-nav */
    .docs-subnav {
        background: var(--bg-surface);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border-bottom: 1px solid var(--border);
        height: 48px;
        display: flex;
        align-items: center;
        position: sticky;
        top: 64px;
        z-index: 90;
    }

    .subnav-container {
        width: 100%;
        max-width: 1600px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        gap: 2rem;
    }

    .subnav-container a {
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        height: 48px;
        display: flex;
        align-items: center;
        position: relative;
    }

    .subnav-container a:hover {
        color: var(--text);
    }

    .subnav-container a.active {
        color: var(--primary);
    }

    .subnav-container a.active::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary);
    }

    /* Layout Container */
    .docs-container {
        display: flex;
        flex: 1;
        max-width: 1600px;
        margin: 0 auto;
        width: 100%;
    }

    /* Sidebar */
    .docs-sidebar {
        width: 280px;
        position: sticky;
        top: 112px;
        height: calc(100vh - 112px);
        overflow-y: auto;
        padding: 1.5rem;
    }

    /* Content Top Actions */
    .content-top-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    .page-actions {
        display: flex;
        gap: 0.75rem;
    }

    /* Main Content */
    .docs-main {
        flex: 1;
        display: flex;
        padding: 1rem 0;
        min-width: 0;
    }

    .content-wrapper {
        flex: 1;
        max-width: 850px;
        margin: 0 auto;
        padding: 0 4rem;
        min-width: 0;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    /* TOC */
    .docs-toc {
        width: 240px;
        padding: 0 1.5rem;
        position: sticky;
        top: 112px;
        height: fit-content;
    }

    .toc-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 1rem;
        padding-top: 2rem;
    }

    .toc-title::before {
        content: "☰";
        font-size: 0.75rem;
    }

    .toc-nav ul {
        list-style: none;
        padding: 0;
        border-inline-start: 1px solid var(--border);
    }

    .toc-nav a {
        display: block;
        padding: 0.2rem 0;
        padding-inline-start: 1rem;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.75rem; /* Smaller font for a cleaner look */
        line-height: 1.5;
        transition: all 0.2s;
        border-inline-start: 2px solid transparent;
        margin-inline-start: -1.5px;
    }

    .toc-nav a:hover {
        color: var(--text);
    }

    .toc-nav a.active {
        color: var(--primary);
        border-inline-start-color: var(--primary);
        font-weight: 600;
        background: rgba(var(--primary-rgb), 0.05);
    }

    :global(.toc-nav code) {
        font-family: var(--font-mono);
        background: rgba(120, 120, 120, 0.1);
        padding: 0.05rem 0.2rem;
        border-radius: 3px;
        font-size: 0.85em;
        color: inherit;
    }

    .toc-nav li.depth-3 {
        padding-inline-start: 1rem;
    }

    @media (max-width: 1200px) {
        .docs-toc {
            display: none;
        }
    }

    @media (max-width: 900px) {
        .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .header-container {
            grid-template-columns: auto 1fr auto;
            gap: 0.75rem;
            padding: 0 1rem;
        }

        .logo-text {
            display: none;
        }

        .docs-sidebar {
            position: fixed;
            inset-inline-start: -280px;
            background: var(--bg);
            z-index: 150;
            top: 64px;
            height: calc(100vh - 64px);
            transition: inset-inline-start 0.3s;
            border-inline-end: 1px solid var(--border);
        }

        .docs-sidebar.open {
            inset-inline-start: 0;
        }

        .header-center {
            display: none;
        }

        .docs-main {
            overflow-x: clip;
        }

        .content-wrapper {
            padding: 0 1.5rem;
            max-width: 100%;
        }

        .subnav-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 1.25rem;
            padding: 0 1rem;
        }

        .subnav-container::-webkit-scrollbar {
            display: none;
        }

        .subnav-container a {
            white-space: nowrap;
            font-size: 0.8125rem;
        }

        .header-actions {
            gap: 0.5rem;
            padding-inline-start: 0.5rem;
        }
    }

    @media (max-width: 600px) {
        .content-top-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
            margin-bottom: 1.5rem;
        }

        .content-wrapper {
            padding: 0 1rem;
        }

        .header-container {
            padding: 0 0.75rem;
        }

        .header-actions {
            gap: 0.35rem;
            border: none;
            padding-inline-start: 0;
        }
    }
</style>
