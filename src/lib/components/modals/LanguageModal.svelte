<script lang="ts">
    import { getI18n, supportedLanguages } from "$lib/i18n.svelte";
    import { fade, scale } from "svelte/transition";
    import { X, Check } from "@lucide/svelte";

    let { show = $bindable(), onClose = null } = $props();
    const i18n = getI18n();

    function selectLang(code: string) {
        i18n.setLang(code);
        show = false;
        onClose?.();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            show = false;
            onClose?.();
        }
    }
</script>

{#if show}
    <div
        class="modal-backdrop"
        transition:fade={{ duration: 200 }}
        onclick={() => {
            show = false;
            onClose?.();
        }}
        role="presentation"
    >
        <div
            class="modal-content"
            transition:scale={{ duration: 300, start: 0.95 }}
            onclick={(e) => e.stopPropagation()}
            onkeydown={handleKeydown}
            role="dialog"
            tabindex="-1"
        >
            <div class="modal-header">
                <h2>
                    {i18n.lang === "fa" ? "انتخاب زبان" : "Select Language"}
                </h2>
                <button
                    class="close-btn"
                    onclick={() => {
                        show = false;
                        onClose?.();
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            <div class="lang-grid">
                {#each supportedLanguages as lang}
                    <button
                        class="lang-option"
                        class:active={i18n.lang === lang.code}
                        onclick={() => selectLang(lang.code)}
                    >
                        <span class="lang-name">{lang.name}</span>
                        {#if i18n.lang === lang.code}
                            <Check size={18} class="check-icon" />
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(11, 16, 27, 0.8);
        backdrop-filter: blur(8px);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }

    :global([data-theme="light"]) .modal-backdrop {
        background: rgba(255, 255, 255, 0.7);
    }

    .modal-content {
        background: var(--bg-sidebar);
        border: 1px solid var(--border);
        border-radius: 24px;
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }

    :global([data-theme="light"]) .modal-content {
        background: #ffffff;
        box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text);
    }

    .close-btn {
        background: rgba(120, 120, 120, 0.1);
        border: none;
        color: var(--text-muted);
        width: 36px;
        height: 36px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .close-btn:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #f87171;
    }

    .lang-grid {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .lang-option {
        background: rgba(120, 120, 120, 0.05);
        border: 1px solid var(--border);
        padding: 1rem 1.25rem;
        border-radius: 16px;
        color: var(--text-muted);
        font-size: 1.125rem;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: start;
    }

    .lang-option:hover {
        background: rgba(59, 130, 246, 0.08);
        border-color: rgba(59, 130, 246, 0.3);
        color: var(--primary);
        transform: translateX(4px);
    }

    .lang-option.active {
        background: var(--primary-glow);
        border-color: var(--primary);
        color: var(--primary);
    }

    :global([dir="rtl"]) .lang-option:hover {
        transform: translateX(-4px);
    }

    :global(.check-icon) {
        color: var(--primary);
    }
</style>
