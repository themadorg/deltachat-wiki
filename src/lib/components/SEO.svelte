<script lang="ts">
    import { page } from "$app/state";
    import { getI18n } from "$lib/i18n.svelte";
    import { config } from "../../config";

    let {
        title = "",
        description = "",
        ogImage = "/icon-512.png",
        noSuffix = false,
    } = $props();

    const i18n = getI18n();

    const siteTitle = i18n.t("brand_logo_text") || config.brand.name;
    const fullTitle = $derived(
        title
            ? noSuffix
                ? title
                : `${title} | ${siteTitle}`
            : i18n.t("site_title"),
    );

    // Use provided description or fallback to i18n/config default
    const metaDescription = $derived(
        description || i18n.t("hero_subtitle") || config.brand.description,
    );

    const canonicalUrl = $derived(`https://deltachat.wiki${page.url.pathname}`);
    const absoluteOgImage = $derived(
        ogImage.startsWith("http")
            ? ogImage
            : `https://deltachat.wiki${ogImage}`,
    );
</script>

<svelte:head>
    <!-- Primary Meta Tags -->
    <title>{fullTitle}</title>
    <meta name="title" content={fullTitle} />
    <meta name="description" content={metaDescription} />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:image" content={absoluteOgImage} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalUrl} />
    <meta property="twitter:title" content={fullTitle} />
    <meta property="twitter:description" content={metaDescription} />
    <meta property="twitter:image" content={absoluteOgImage} />

    <!-- Canonical -->
    <link rel="canonical" href={canonicalUrl} />
</svelte:head>
