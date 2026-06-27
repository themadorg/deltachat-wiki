<script lang="ts">
    import { ArrowLeft, Sun, Moon, ExternalLink, FileText } from "@lucide/svelte";
    import { getI18n } from "$lib/i18n.svelte";
    import { theme } from "$lib/theme.svelte";
    import Logo from "$lib/components/Logo.svelte";
    import SEO from "$lib/components/SEO.svelte";

    let { data } = $props();
    const i18n = getI18n();

    const datatrackerUrl = $derived(`https://datatracker.ietf.org/doc/html/${data.rfc}`);
</script>

<SEO title={data.title} description={`Offline plain-text copy of ${data.title}.`} />

<div class="rfc-page">
    <header class="rfc-header">
        <div class="rfc-header-inner">
            <a href="/{i18n.lang}/docs/building/rfcs" class="back-link">
                <ArrowLeft size={16} />
                <span>{i18n.lang === "fa" ? "بازگشت به RFCها" : "RFCs"}</span>
            </a>

            <a href="/{i18n.lang}" class="brand">
                <Logo size={22} />
                <span>{i18n.t("brand_logo_text")}</span>
            </a>

            <div class="header-actions">
                <button
                    class="icon-btn"
                    onclick={() => theme.toggle()}
                    aria-label="Toggle theme"
                >
                    {#if theme.current === "dark"}
                        <Sun size={18} />
                    {:else}
                        <Moon size={18} />
                    {/if}
                </button>
            </div>
        </div>
    </header>

    <main class="rfc-main">
        <div class="rfc-titlebar">
            <h1 class="rfc-title">{data.title}</h1>
            <div class="rfc-links">
                <a href="/rfcs/{data.rfc}/raw" target="_blank" rel="noopener noreferrer" class="rfc-link">
                    <FileText size={14} />
                    {i18n.lang === "fa" ? "متن خام" : "Raw .txt"}
                </a>
                <a href={datatrackerUrl} target="_blank" rel="noopener noreferrer" class="rfc-link">
                    <ExternalLink size={14} />
                    IETF Datatracker
                </a>
            </div>
        </div>

        <pre class="rfc-content">{data.content}</pre>
    </main>
</div>

<style>
    .rfc-page {
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
    }

    .rfc-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--bg-surface);
        backdrop-filter: blur(12px) saturate(180%);
        -webkit-backdrop-filter: blur(12px) saturate(180%);
        border-bottom: 1px solid var(--border);
    }

    .rfc-header-inner {
        max-width: 1000px;
        margin: 0 auto;
        height: 60px;
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--text-muted);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 600;
        transition: color 0.2s ease;
    }

    .back-link:hover {
        color: var(--primary);
    }

    .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary);
        text-decoration: none;
        font-weight: 700;
    }

    .brand span {
        color: var(--text);
        font-size: 1rem;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .icon-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0.35rem;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .icon-btn:hover {
        color: var(--text);
        background: rgba(120, 120, 120, 0.1);
    }

    .rfc-main {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
    }

    .rfc-titlebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .rfc-title {
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--text);
        margin: 0;
        letter-spacing: -0.02em;
    }

    .rfc-links {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .rfc-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: rgba(var(--primary-rgb), 0.05);
        color: var(--text);
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .rfc-link:hover {
        border-color: var(--primary);
        color: var(--primary);
        background: rgba(var(--primary-rgb), 0.1);
    }

    .rfc-content {
        margin: 0;
        padding: 1.75rem;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--bg-sidebar);
        color: var(--text);
        font-family: var(--font-mono, "Fira Code", "JetBrains Mono", monospace);
        font-size: 0.82rem;
        line-height: 1.55;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-x: auto;
        direction: ltr;
        text-align: left;
    }

    @media (max-width: 640px) {
        .rfc-header-inner,
        .rfc-main {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .rfc-title {
            font-size: 1.35rem;
        }

        .rfc-content {
            padding: 1rem;
            font-size: 0.72rem;
        }
    }
</style>
