<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { isWebxdc } from "$lib/webxdc.svelte";
    import { getI18n } from "$lib/i18n.svelte";
    import { copyToClipboard } from "$lib/clipboard";

    let { src, poster, type = "video/mp4" } = $props();

    const i18n = getI18n();
    let videoElement: HTMLVideoElement = $state() as HTMLVideoElement;
    let player: any;
    let copied = $state(false);

    function copyUrl() {
        copyToClipboard(src).then((ok) => {
            if (ok) {
                copied = true;
                setTimeout(() => (copied = false), 2000);
            }
        });
    }

    onMount(async () => {
        if (isWebxdc) return; // Don't load video.js in webxdc

        const videojs = (await import("video.js")).default;
        await import("video.js/dist/video-js.css");

        player = videojs(videoElement, {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{ src, type }],
        });
    });

    onDestroy(() => {
        if (player) {
            player.dispose();
        }
    });
</script>

{#if isWebxdc}
    <div class="video-placeholder">
        <div class="placeholder-icon">▶</div>
        <h4>{i18n.t("video_unavailable_title")}</h4>
        <p>{i18n.t("video_unavailable_desc")}</p>
        <div class="video-url">
            <code>{src}</code>
        </div>
        <button class="copy-url-btn" onclick={copyUrl}>
            {copied ? "✓ " + i18n.t("copied") : i18n.t("external_link_copy")}
        </button>
    </div>
{:else}
    <div class="video-container">
        <div data-vjs-player>
            <video
                bind:this={videoElement}
                class="video-js vjs-big-play-centered vjs-theme-city"
            ></video>
        </div>
    </div>
{/if}

<style>
    .video-placeholder {
        margin: 2rem 0;
        padding: 2.5rem 2rem;
        border-radius: 12px;
        border: 1px dashed var(--border);
        background: rgba(120, 120, 120, 0.04);
        text-align: center;
    }

    .placeholder-icon {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(var(--primary-rgb), 0.1);
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-size: 1.5rem;
    }

    .video-placeholder h4 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text);
    }

    .video-placeholder p {
        margin: 0 0 1rem;
        font-size: 0.875rem;
        color: var(--text-muted);
        line-height: 1.5;
    }

    .video-url {
        background: rgba(120, 120, 120, 0.08);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.6rem 1rem;
        margin-bottom: 1rem;
        word-break: break-all;
    }

    .video-url code {
        font-size: 0.8rem;
        color: var(--primary);
        font-family: "SF Mono", "Fira Code", monospace;
    }

    .copy-url-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1.25rem;
        background: var(--primary);
        color: var(--primary-fg);
        border: none;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .copy-url-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
    }

    .video-container {
        margin: 2rem 0;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    :global(.video-js) {
        background-color: #0b101b;
    }

    :global(.vjs-big-play-button) {
        background-color: var(--primary) !important;
        border-color: var(--primary) !important;
        border-radius: 50% !important;
        width: 3em !important;
        height: 3em !important;
        line-height: 3em !important;
        margin-top: -1.5em !important;
        margin-left: -1.5em !important;
    }

    :global(.vjs-control-bar) {
        background-color: rgba(11, 16, 27, 0.8) !important;
    }
</style>
