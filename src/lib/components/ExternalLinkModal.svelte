<script lang="ts">
    import { externalLink } from "$lib/webxdc.svelte";
    import { getI18n } from "$lib/i18n.svelte";
    import { copyToClipboard } from "$lib/clipboard";
    import { ExternalLink, Copy, Check, X } from "@lucide/svelte";

    const i18n = getI18n();
    let copied = $state(false);

    function copyUrl() {
        copyToClipboard(externalLink.url).then((ok) => {
            if (ok) {
                copied = true;
                setTimeout(() => (copied = false), 2000);
            }
        });
    }
</script>

{#if externalLink.show}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="overlay"
        onclick={() => externalLink.close()}
        onkeydown={(e) => e.key === "Escape" && externalLink.close()}
    >
        <div
            class="modal"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <button
                class="close-btn"
                onclick={() => externalLink.close()}
                aria-label="Close"
            >
                <X size={18} />
            </button>

            <div class="icon-wrap">
                <ExternalLink size={28} />
            </div>

            <h3>{i18n.t("external_link_title")}</h3>
            <p>{i18n.t("external_link_desc")}</p>

            <div class="url-box">
                <code>{externalLink.url}</code>
            </div>

            <button class="copy-btn" onclick={copyUrl}>
                {#if copied}
                    <Check size={16} />
                    {i18n.t("copied")}
                {:else}
                    <Copy size={16} />
                    {i18n.t("external_link_copy")}
                {/if}
            </button>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.15s ease;
    }

    .modal {
        background: var(--bg, #0b101b);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 2rem;
        max-width: 420px;
        width: 100%;
        text-align: center;
        position: relative;
        animation: slideUp 0.2s ease;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }

    :global([data-theme="light"]) .modal {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    }

    .close-btn {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 6px;
        transition: all 0.15s;
    }
    .close-btn:hover {
        background: rgba(120, 120, 120, 0.1);
        color: var(--text);
    }

    .icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: linear-gradient(
            135deg,
            rgba(var(--primary-rgb), 0.12),
            rgba(19, 211, 186, 0.12)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        color: var(--primary);
    }

    h3 {
        margin: 0 0 0.5rem;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text);
    }

    p {
        margin: 0 0 1.25rem;
        font-size: 0.875rem;
        color: var(--text-muted);
        line-height: 1.5;
    }

    .url-box {
        background: rgba(120, 120, 120, 0.08);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        margin-bottom: 1.25rem;
        word-break: break-all;
    }

    .url-box code {
        font-size: 0.8rem;
        color: var(--primary);
        font-family: "SF Mono", "Fira Code", monospace;
    }

    .copy-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1.5rem;
        background: var(--primary);
        color: var(--primary-fg);
        border: none;
        border-radius: 10px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .copy-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.3);
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
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
