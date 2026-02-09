<script lang="ts">
    let { number, title, children, isLast = false } = $props();
</script>

<div class="step-item">
    <div class="step-indicator">
        <div class="step-badge">
            {number}
        </div>
        {#if !isLast}
            <div class="step-connector"></div>
        {/if}
    </div>
    <div class="step-body">
        {#if title}
            <h3 class="step-title">{title}</h3>
        {/if}
        <div class="step-inner">
            {@render children?.()}
        </div>
    </div>
</div>

<style>
    .step-item {
        display: flex;
        gap: 2rem; /* Increased gap */
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .step-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        width: 38px;
        padding-top: 0.25rem; /* Better alignment with the first line of text */
    }

    .step-badge {
        width: 38px;
        height: 38px;
        background: rgba(255, 255, 255, 0.03);
        color: var(--text);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 1rem;
        border: 1px solid var(--border);
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        backdrop-filter: blur(8px);
        line-height: 1; /* Essential for perfect vertical centering of numbers */
    }

    :global([data-theme="light"]) .step-badge {
        background: rgba(0, 0, 0, 0.02);
        border-color: rgba(0, 0, 0, 0.08);
        color: var(--text);
    }

    .step-connector {
        width: 2px;
        flex-grow: 1;
        background: linear-gradient(to bottom, var(--primary), transparent);
        margin: 12px 0; /* More space around the connector */
        opacity: 0.15;
        border-radius: 1px;
    }

    .step-body {
        flex-grow: 1;
        padding-bottom: 3rem; /* Increased distance between steps */
        min-width: 0;
    }

    .step-item:last-child .step-body {
        padding-bottom: 0;
    }

    .step-title {
        margin: 0 0 0.6rem 0;
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text);
        line-height: 1.3;
        letter-spacing: -0.01em;
    }

    .step-inner {
        color: var(--text-muted);
        line-height: 1.7;
        font-size: 1.05rem;
    }

    :global(.step-inner p) {
        margin: 0 !important;
    }

    :global(.step-inner p + p) {
        margin-top: 1rem !important;
    }

    /* Hover effect */
    .step-item:hover .step-badge {
        border-color: var(--primary);
        color: var(--primary);
        background: rgba(var(--primary-rgb), 0.1);
        transform: scale(1.08) translateY(-2px);
        box-shadow: 0 10px 25px -10px rgba(var(--primary-rgb), 0.4);
    }

    .step-item:hover .step-connector {
        opacity: 0.4;
        background: var(--primary);
    }

    :global([data-theme="light"]) .step-item:hover .step-badge {
        background: rgba(var(--primary-rgb), 0.05);
    }
</style>
