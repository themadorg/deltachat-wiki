<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        // Detect user's preferred language from the browser
        const browserLang = navigator.language?.split("-")[0];
        const supportedLangs = ["en", "fa"];
        const lang = supportedLangs.includes(browserLang) ? browserLang : "fa";
        goto(`/${lang}`, { replaceState: true });
    });
</script>

<svelte:head>
    <meta http-equiv="refresh" content="0; url=/fa" />
    <title>Delta Chat Guide - Redirecting...</title>
</svelte:head>

<div
    style="display: flex; align-items: center; justify-content: center; height: 100vh; color: var(--text-muted, #888);"
>
    <p>Redirecting...</p>
</div>
