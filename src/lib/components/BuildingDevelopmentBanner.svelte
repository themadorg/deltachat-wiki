<script lang="ts">
    import { Construction } from "@lucide/svelte";
    import { getI18n } from "$lib/i18n.svelte";

    const i18n = getI18n();
</script>

<aside class="building-dev-banner" role="status">
    <Construction size={18} aria-hidden="true" />
    <div class="banner-copy">
        <strong>{i18n.t("building_under_development_title")}</strong>
        <span>{i18n.t("building_under_development_message")}</span>
    </div>
</aside>

<style>
    .building-dev-banner {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin: 0 0 1.75rem;
        padding: 0.85rem 1rem;
        border: 1px solid rgba(245, 158, 11, 0.45);
        border-radius: 12px;
        background: rgba(245, 158, 11, 0.1);
        color: var(--text);
        line-height: 1.45;
    }

    .building-dev-banner :global(svg) {
        flex-shrink: 0;
        margin-top: 0.1rem;
        color: #f59e0b;
    }

    .banner-copy {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        font-size: 0.88rem;
    }

    .banner-copy strong {
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #f59e0b;
    }

    .banner-copy span {
        color: var(--text-muted);
    }
</style>
