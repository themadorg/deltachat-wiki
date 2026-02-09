<script lang="ts">
    import { getI18n } from "$lib/i18n.svelte";
    import { copyToClipboard } from "$lib/clipboard";
    import {
        Copy,
        Check,
        ChevronDown,
        FileCode,
        ExternalLink,
        MessageSquare,
        Monitor,
        Terminal,
        Cpu,
    } from "@lucide/svelte";
    import { onMount, type Component } from "svelte";
    import { fade, slide } from "svelte/transition";

    import { page } from "$app/state";
    import { getRawDoc } from "$lib/docs";

    const i18n = getI18n();

    let copied = $state(false);
    let isOpen = $state(false);
    let dropdownElement = $state<HTMLElement>();

    async function copyLink() {
        if (typeof window === "undefined") return;
        const slug = page.params.path;
        const lang = page.params.lang || i18n.lang;

        if (slug) {
            const raw = await getRawDoc(slug, lang);
            if (raw) {
                copyToClipboard(raw).then(() => {
                    copied = true;
                    setTimeout(() => (copied = false), 2000);
                    isOpen = false;
                });
                return;
            }
        }

        // Fallback to link if something fails
        const text = `[${document.title.split(" - ")[0]}](${window.location.href})`;
        copyToClipboard(text).then(() => {
            copied = true;
            setTimeout(() => (copied = false), 2000);
            isOpen = false;
        });
    }

    function handleClickOutside(event: MouseEvent) {
        if (
            dropdownElement &&
            !dropdownElement.contains(event.target as Node)
        ) {
            isOpen = false;
        }
    }

    onMount(() => {
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    });

    interface Action {
        id: string;
        icon: Component;
        label: string;
        description: string;
        action: () => void;
        external?: boolean;
    }

    const actions: Action[] = [
        {
            id: "copy",
            icon: Copy,
            label: "Copy page",
            description: "Copy page as Markdown for LLMs",
            action: copyLink,
        },
        {
            id: "markdown",
            icon: FileCode,
            label: "View as Markdown",
            description: "View this page as plain text",
            action: () => {
                if (typeof window === "undefined") return;
                // Append ?markdown=1 and open in new tab
                const url = new URL(window.location.href);
                url.searchParams.set("markdown", "1");
                window.open(url.toString(), "_blank");
                isOpen = false;
            },
            external: true,
        },
        /* Commenting out for later
        {
            id: "chatgpt",
            icon: MessageSquare,
            label: "Open in ChatGPT",
            description: "Ask questions about this page",
            action: () => {},
            external: true,
        },
        {
            id: "claude",
            icon: Cpu,
            label: "Open in Claude",
            description: "Ask questions about this page",
            action: () => {},
            external: true,
        },
        {
            id: "cursor",
            icon: Monitor,
            label: "Connect to Cursor",
            description: "Install MCP Server on Cursor",
            action: () => {},
            external: true,
        },
        {
            id: "vscode",
            icon: Terminal,
            label: "Connect to VS Code",
            description: "Install MCP Server on VS Code",
            action: () => {},
            external: true,
        },
        */
    ];
</script>

<div class="copy-actions-wrapper" bind:this={dropdownElement}>
    <div class="split-button-container">
        <button class="main-copy-btn" onclick={copyLink} class:success={copied}>
            <div class="btn-icon">
                {#if copied}
                    <Check size={16} />
                {:else}
                    <Copy size={16} />
                {/if}
            </div>
            <span class="btn-text">
                {copied ? i18n.t("copied") : i18n.t("copy_page")}
            </span>
        </button>
        <button
            class="dropdown-trigger-btn"
            class:active={isOpen}
            onclick={() => (isOpen = !isOpen)}
            aria-label="More actions"
        >
            <ChevronDown size={16} />
        </button>
    </div>

    {#if isOpen}
        <div class="actions-dropdown" transition:fade={{ duration: 100 }}>
            <div class="dropdown-content">
                {#each actions as action}
                    <button class="menu-item" onclick={action.action}>
                        <div class="item-icon-container">
                            <action.icon size={18} />
                        </div>
                        <div class="item-details">
                            <div class="item-title">
                                {action.label}
                                {#if action.external}
                                    <ExternalLink
                                        size={12}
                                        class="external-icon-svg"
                                    />
                                {/if}
                            </div>
                            <div class="item-description">
                                {action.description}
                            </div>
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .copy-actions-wrapper {
        position: relative;
        display: inline-block;
    }

    .split-button-container {
        display: flex;
        align-items: stretch;
        background: rgba(120, 120, 120, 0.05);
        border: 1px solid var(--border);
        border-radius: 8px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .split-button-container:hover {
        background: rgba(120, 120, 120, 0.1);
        border-color: var(--primary);
        box-shadow: 0 0 0 4px var(--primary-glow);
    }

    .main-copy-btn,
    .dropdown-trigger-btn {
        background: none;
        border: none;
        color: var(--text);
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.2s;
    }

    .main-copy-btn {
        padding: 0.5rem 0.875rem;
        gap: 0.625rem;
        font-size: 0.875rem;
        font-weight: 600;
        border-inline-end: 1px solid var(--border);
    }

    .main-copy-btn.success {
        color: var(--primary);
    }

    .btn-icon {
        display: flex;
        align-items: center;
        opacity: 0.9;
    }

    .dropdown-trigger-btn {
        padding: 0 0.5rem;
        opacity: 0.7;
    }

    .dropdown-trigger-btn:hover,
    .dropdown-trigger-btn.active {
        opacity: 1;
        background: rgba(120, 120, 120, 0.1);
    }

    .actions-dropdown {
        position: absolute;
        top: calc(100% + 0.5rem);
        inset-inline-end: 0;
        width: 280px;
        z-index: 1000;
    }

    .dropdown-content {
        background: #0f172a; /* Dark sleek background */
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 0.5rem;
        box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.5),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    :global([data-theme="light"]) .dropdown-content {
        background: #ffffff;
        box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: none;
        border: none;
        border-radius: 8px;
        color: var(--text);
        cursor: pointer;
        text-align: start;
        transition: all 0.2s;
        width: 100%;
    }

    .menu-item:hover {
        background: rgba(120, 120, 120, 0.1);
    }

    .item-icon-container {
        width: 36px;
        height: 36px;
        background: rgba(120, 120, 120, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: var(--text-muted);
    }

    .menu-item:hover .item-icon-container {
        color: var(--primary);
        background: var(--primary-glow);
    }

    .item-details {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
    }

    .item-title {
        font-size: 0.9375rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .item-description {
        font-size: 0.75rem;
        color: var(--text-muted);
        line-height: 1.4;
    }

    :global(.external-icon-svg) {
        opacity: 0.4;
    }
</style>
