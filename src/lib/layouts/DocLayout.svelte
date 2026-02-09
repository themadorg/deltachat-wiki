<script lang="ts">
    import { onMount } from "svelte";
    import mediumZoom from "medium-zoom";

    onMount(() => {
        const zoom = mediumZoom(".prose img", {
            margin: 24,
            background: "rgba(11, 16, 27, 0.9)",
        });

        return () => zoom.detach();
    });
</script>

<div class="mdsvex-doc prose">
    <slot />
</div>

<style>
    .mdsvex-doc {
        max-width: 100%;
    }

    /* Center images globally in the doc */
    :global(.prose img) {
        display: block;
        margin: 2rem auto;
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        cursor: zoom-in;
        transition: transform 0.3s ease;
    }

    :global(.medium-zoom-overlay) {
        z-index: 1000;
        backdrop-filter: blur(8px);
    }

    :global(.medium-zoom-image--opened) {
        z-index: 1001;
        border-radius: 0 !important;
    }

    /* Style for markdown content */
    :global(.prose) {
        color: var(--text);
        line-height: 1.7;
    }
</style>
