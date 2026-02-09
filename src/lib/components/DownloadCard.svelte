<script lang="ts">
    import LucideIcon from "./LucideIcon.svelte";
    import { copyToClipboard } from "$lib/clipboard";

    let {
        platform,
        icon,
        description,
        links = [],
        commands = [],
        children,
    } = $props();

    // Link type styles
    const getLinkClass = (type: string) => {
        switch (type) {
            case "primary":
                return "download-link-primary";
            case "secondary":
                return "download-link-secondary";
            case "code":
                return "download-link-code";
            default:
                return "download-link-secondary";
        }
    };
</script>

<div class="download-card">
    <div class="download-header">
        <div class="platform-icon">
            <LucideIcon name={icon} size={32} />
        </div>
        <div class="header-text">
            <h3 class="platform-title">{platform}</h3>
            {#if description}
                <p class="platform-description">{description}</p>
            {/if}
        </div>
    </div>

    <div class="download-content">
        {#if links.length > 0}
            <div class="links-section">
                {#each links as link}
                    <a
                        href={link.href}
                        class="download-button {getLinkClass(link.type)}"
                    >
                        {#if link.type === "primary"}
                            <LucideIcon name="Download" size={18} />
                        {:else if link.type === "code"}
                            <LucideIcon name="Github" size={18} />
                        {/if}
                        <span>{link.label}</span>
                    </a>
                {/each}
            </div>
        {/if}

        {#if commands.length > 0}
            <div class="commands-section">
                {#each commands as cmd}
                    <div class="command-box">
                        <code class="command-text">{cmd}</code>
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            class="copy-btn"
                            onclick={() => copyToClipboard(cmd)}
                            title="Copy command"
                        >
                            <LucideIcon name="Copy" size={14} />
                        </button>
                    </div>
                {/each}
            </div>
        {/if}

        {#if children}
            <div class="extra-content">
                {@render children?.()}
            </div>
        {/if}
    </div>
</div>

<style>
    .download-card {
        background: rgba(var(--bg-card-rgb, 255, 255, 255), 0.05);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        position: relative;
        overflow: hidden;
    }

    :global([data-theme="light"]) .download-card {
        background: #ffffff;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }

    .download-card:hover {
        transform: translateY(-4px);
        border-color: var(--primary);
        box-shadow: 0 12px 30px -10px rgba(var(--primary-rgb), 0.15);
    }

    .download-header {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .platform-icon {
        width: 56px;
        height: 56px;
        background: rgba(var(--primary-rgb), 0.1);
        color: var(--primary);
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .platform-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    .platform-description {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        color: var(--text-muted);
        line-height: 1.4;
    }

    .download-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .links-section {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .download-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 0.85rem 1.25rem;
        border-radius: 12px;
        font-size: 0.95rem;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%;
        border: 1px solid transparent;
    }

    .download-link-primary {
        background: var(--primary);
        color: var(--primary-fg) !important; /* Force high contrast text */
    }

    .download-link-primary:hover {
        background: #4ef091; /* Brighten the green for better hover state */
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
    }

    :global([data-theme="light"]) .download-link-primary:hover {
        background: #00a467;
    }

    .download-link-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text);
        border: 1px solid var(--border);
    }

    :global([data-theme="light"]) .download-link-secondary {
        background: rgba(0, 0, 0, 0.03);
        border-color: rgba(0, 0, 0, 0.1);
    }

    .download-link-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--primary);
        color: var(--primary);
    }

    :global([data-theme="light"]) .download-link-secondary:hover {
        background: rgba(0, 0, 0, 0.06);
        border-color: var(--primary);
        color: var(--primary);
    }

    .download-link-code {
        background: rgba(var(--primary-rgb), 0.05);
        color: var(--primary);
        border: 1px solid rgba(var(--primary-rgb), 0.2);
    }

    .download-link-code:hover {
        background: var(--primary);
        color: var(--primary-fg) !important;
        border-color: var(--primary);
    }

    .commands-section {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        margin-top: 0.5rem;
    }

    .command-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.6rem 0.85rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: border-color 0.2s;
    }

    .command-box:hover {
        border-color: rgba(var(--primary-rgb), 0.4);
    }

    :global([data-theme="light"]) .command-box {
        background: #f8fafc;
        border-color: rgba(0, 0, 0, 0.08);
    }

    .command-text {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            monospace;
        font-size: 0.85rem;
        color: var(--text);
        word-break: break-all;
        opacity: 0.9;
    }

    .copy-btn {
        background: transparent;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
    }

    .copy-btn:hover {
        background: rgba(var(--primary-rgb), 0.1);
        color: var(--primary);
    }

    .extra-content {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.5;
        border-top: 1px solid var(--border);
        padding-top: 1rem;
        margin-top: 0.5rem;
    }
</style>
