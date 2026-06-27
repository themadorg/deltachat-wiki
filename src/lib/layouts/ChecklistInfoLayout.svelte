<div class="checklist-info-doc prose">
    <slot />
</div>

<style>
    .checklist-info-doc {
        max-width: 100%;
        font-size: 0.95rem;
        line-height: 1.65;
        color: var(--text);
    }

    :global(.checklist-info-doc > :first-child) {
        margin-top: 0;
    }

    :global(.checklist-info-doc > :last-child) {
        margin-bottom: 0;
    }

    :global(.checklist-info-doc h1),
    :global(.checklist-info-doc h2),
    :global(.checklist-info-doc h3) {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text);
        margin: 0 0 0.65rem;
        border: none;
        padding: 0;
        line-height: 1.35;
    }

    :global(.checklist-info-doc p) {
        margin: 0 0 0.75rem;
        color: var(--text-muted);
    }

    :global(.checklist-info-doc p:last-child) {
        margin-bottom: 0;
    }

    :global(.checklist-info-doc ul),
    :global(.checklist-info-doc ol) {
        margin: 0 0 0.75rem;
        padding-inline-start: 1.15rem;
        color: var(--text-muted);
    }

    :global(.checklist-info-doc li) {
        margin-bottom: 0.25rem;
    }

    :global(.checklist-info-doc code) {
        background: rgba(var(--primary-rgb), 0.08);
        padding: 0.1rem 0.3rem;
        border-radius: 4px;
        font-size: 0.82em;
        color: var(--text);
    }

    :global(.checklist-info-doc a) {
        color: var(--primary);
    }
</style>
