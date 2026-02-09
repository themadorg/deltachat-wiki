<script lang="ts">
    let { cols = 2, children } = $props();
</script>

<div class="tool-grid" style="--cols: {cols}">
    {@render children?.()}
</div>

<style>
    .tool-grid {
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 1rem;
        margin: 2rem 0;
    }

    @media (min-width: 640px) {
        .tool-grid {
            grid-template-columns: repeat(var(--cols, 2), 1fr);
        }
    }
</style>
