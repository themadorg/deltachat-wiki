<script lang="ts">
    import { page } from "$app/state";
    import { getI18n } from "$lib/i18n.svelte";
    import { FileQuestion, Home, ArrowLeft } from "@lucide/svelte";

    const i18n = getI18n();
    const status = $derived(page.status);
    const message = $derived(page.error?.message || "Page not found");
</script>

<div class="error-page">
    <div class="error-container">
        <div class="error-icon">
            <FileQuestion size={64} />
        </div>

        <h1 class="error-code">{status}</h1>
        <h2 class="error-title">
            {#if status === 404}
                {i18n.lang === "fa"
                    ? "صفحه مورد نظر پیدا نشد"
                    : "Page Not Found"}
            {:else}
                {i18n.lang === "fa" ? "خطایی رخ داده است" : "An error occurred"}
            {/if}
        </h2>

        <p class="error-message">{message}</p>

        <div class="error-actions">
            <a
                href="/{i18n.lang}/docs/general/introduction"
                class="btn btn-primary"
            >
                <ArrowLeft size={18} />
                {i18n.lang === "fa" ? "بازگشت به مستندات" : "Back to Docs"}
            </a>
            <a href="/{i18n.lang}" class="btn btn-outline">
                <Home size={18} />
                {i18n.lang === "fa" ? "صفحه اصلی" : "Home"}
            </a>
        </div>
    </div>
</div>

<style>
    .error-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        padding: 2rem;
        text-align: center;
    }

    .error-container {
        max-width: 500px;
        width: 100%;
    }

    .error-icon {
        color: var(--primary);
        margin-bottom: 2rem;
        display: flex;
        justify-content: center;
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .error-code {
        font-size: 5rem;
        font-weight: 900;
        margin: 0;
        line-height: 1;
        background: linear-gradient(135deg, var(--primary) 0%, #2dd4bf 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        opacity: 0.5;
    }

    .error-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 1rem 0;
        color: var(--text);
    }

    .error-message {
        color: var(--text-muted);
        margin-bottom: 3rem;
        font-size: 1.1rem;
    }

    .error-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
        font-size: 0.9375rem;
    }

    .btn-primary {
        background: var(--primary);
        color: #0b101b;
    }

    .btn-primary:hover {
        opacity: 0.9;
        transform: translateY(-2px);
    }

    .btn-outline {
        border: 1px solid var(--border);
        color: var(--text);
    }

    .btn-outline:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-2px);
    }

    :global([dir="rtl"]) .error-actions {
        flex-direction: row-reverse;
    }
</style>
