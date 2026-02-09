<script lang="ts">
    import { page } from "$app/state";
    import { getI18n } from "$lib/i18n.svelte";
    import { theme } from "$lib/theme.svelte";
    import { Languages, Sun, Moon } from "@lucide/svelte";
    import LanguageModal from "$lib/components/modals/LanguageModal.svelte";
    import Logo from "$lib/components/Logo.svelte";

    let { children } = $props();
    const i18n = getI18n();
    let showLangModal = $state(false);
</script>

<div class="pages-layout">
    <nav class="top-nav">
        <div class="nav-content">
            <a href="/" class="logo">
                <span class="icon">
                    <Logo size={32} class="page-header-logo-img" />
                </span>
                <span class="text">{i18n.t("brand_logo_text")}</span>
            </a>
            <div class="nav-right">
                <div class="links">
                    <a href="/" class:active={page.url.pathname === "/"}
                        >{i18n.t("nav_home")}</a
                    >
                </div>
                <div class="nav-actions">
                    <button
                        class="action-btn"
                        onclick={() => theme.toggle()}
                        title={theme.current === "dark"
                            ? "Light Mode"
                            : "Dark Mode"}
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
                        title={i18n.lang === "fa"
                            ? "انتخاب زبان"
                            : "Select Language"}
                    >
                        <Languages size={20} />
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <LanguageModal bind:show={showLangModal} />

    <main class="main-content">
        {@render children()}
    </main>

    <footer class="footer">
        <p>
            © {new Date().getFullYear()}
            {i18n.t("brand_name")}. Independent Wiki.
        </p>
    </footer>
</div>

<style>
    .pages-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .top-nav {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        position: sticky;
        top: 0;
        z-index: 50;
        height: 64px;
        display: flex;
        align-items: center;
        transition: all 0.3s ease;
    }

    :global([data-theme="light"]) .top-nav {
        background: rgba(255, 255, 255, 0.8);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .nav-content {
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        font-weight: 850;
        font-size: 1.3rem;
        color: white;
        transition: all 0.3s ease;
        letter-spacing: -0.02em;
        line-height: 1;
    }

    :global([data-theme="light"]) .logo {
        color: #0f172a;
    }

    .logo .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        height: 32px;
    }

    .logo:hover .icon {
        transform: rotate(-10deg) scale(1.1);
    }

    :global(.page-header-logo-img) {
        width: 32px;
        height: 32px;
        color: var(--primary);
    }

    .links {
        display: flex;
        gap: 2rem;
    }

    .links a {
        text-decoration: none;
        color: #94a3b8;
        font-weight: 650;
        font-size: 0.95rem;
        transition: all 0.2s;
        position: relative;
        padding: 0.25rem 0;
    }

    :global([data-theme="light"]) .links a {
        color: #64748b;
    }

    .links a::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--primary);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
    }

    .links a:hover::after,
    .links a.active::after {
        transform: scaleX(1);
        transform-origin: left;
    }

    .links a:hover,
    .links a.active {
        color: var(--primary);
    }

    .nav-right {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .action-btn {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #94a3b8;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global([data-theme="light"]) .action-btn {
        background: rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(0, 0, 0, 0.05);
        color: #64748b;
    }

    .action-btn:hover {
        background: rgba(59, 130, 246, 0.1);
        border-color: rgba(59, 130, 246, 0.4);
        color: #3b82f6;
        transform: translateY(-1px);
    }

    .main-content {
        flex: 1;
    }

    .footer {
        padding: 4rem 2rem;
        text-align: center;
        border-top: 1px solid var(--border);
        color: var(--text-muted);
        font-size: 0.875rem;
    }
</style>
