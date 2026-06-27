<script lang="ts">
    import { X, ExternalLink } from "@lucide/svelte";
    import { getI18n } from "$lib/i18n.svelte";
    import { loadChecklistInfo } from "$lib/checklists/load";

    let {
        title = "",
        infoSlug = "",
        href = undefined,
        onclose
    }: {
        title: string;
        infoSlug: string;
        href?: string;
        onclose: () => void;
    } = $props();

    const isExternal = $derived(!!href && /^https?:\/\//.test(href));

    const i18n = getI18n();
    let InfoDoc = $state<any>(null);

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") onclose();
    }

    $effect(() => {
        if (!infoSlug) {
            InfoDoc = null;
            return;
        }

        let cancelled = false;
        loadChecklistInfo(infoSlug).then((component) => {
            if (!cancelled) InfoDoc = component;
        });

        return () => {
            cancelled = true;
        };
    });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="overlay">
    <button type="button" class="backdrop" onclick={onclose} aria-label={i18n.t("checklist_info_close")}></button>
    <div
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
    >
        <div class="modal-header">
            <h2 class="modal-title">{title}</h2>
            <div class="modal-header-actions">
                {#if href}
                    <a
                        class="open-page-btn"
                        {href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                        <ExternalLink size={14} />
                        {i18n.t("checklist_open_page")}
                    </a>
                {/if}
                <button type="button" class="close-btn" onclick={onclose} aria-label={i18n.t("checklist_info_close")}>
                    <X size={16} />
                </button>
            </div>
        </div>

        <div class="info-body">
            {#if InfoDoc}
                {@const Doc = InfoDoc}
                <Doc />
            {:else}
                <p class="loading">{i18n.t("checklist_info_loading")}</p>
            {/if}
        </div>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.15s ease;
    }

    .backdrop {
        position: absolute;
        inset: 0;
        border: none;
        padding: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
        cursor: default;
    }

    .modal {
        background: var(--bg, #0b101b);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 0;
        width: min(96vw, 1024px);
        min-height: min(75vh, 640px);
        max-height: min(92vh, 920px);
        overflow: hidden;
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        animation: slideUp 0.2s ease;
        box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.35);
    }

    :global([data-theme="light"]) .modal {
        box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.12);
    }

    .modal-header {
        position: sticky;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1.25rem 2.25rem;
        background: var(--bg, #0b101b);
        border-bottom: 1px solid var(--border);
        flex-shrink: 0;
        z-index: 1;
    }

    .modal-title {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text);
        line-height: 1.35;
        border: none;
        padding: 0;
    }

    .modal-header-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;
    }

    .open-page-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.4rem 0.75rem;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: rgba(var(--primary-rgb), 0.06);
        color: var(--primary);
        font-size: 0.8rem;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        transition: all 0.2s ease;
    }

    .open-page-btn:hover {
        border-color: var(--primary);
        background: rgba(var(--primary-rgb), 0.12);
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 6px;
        transition: color 0.15s ease;
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    .close-btn:hover {
        color: var(--text);
    }

    .info-body {
        flex: 1;
        overflow-y: auto;
        padding: 1.75rem 2.25rem 2.25rem;
    }

    .info-body :global(.checklist-info-doc > h1:first-child) {
        display: none;
    }

    .loading {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
