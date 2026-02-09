<script lang="ts">
    let { children } = $props();
</script>

<div class="steps-container">
    {@render children?.()}
</div>

<style>
    .steps-container {
        display: flex;
        flex-direction: column;
        margin: 2.5rem 0;
        gap: 0;
        width: 100%;
        min-width: 0;
    }
</style>
