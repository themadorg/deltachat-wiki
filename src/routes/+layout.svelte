<script lang="ts">
	import "./layout.css";
	import { setI18n, supportedLanguages } from "$lib/i18n.svelte";
	import { theme } from "$lib/theme.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { handleExternalClick } from "$lib/webxdc.svelte";
	import Footer from "$lib/components/Footer.svelte";
	import ExternalLinkModal from "$lib/components/ExternalLinkModal.svelte";
	import SEO from "$lib/components/SEO.svelte";

	let { children } = $props();

	// Derive language from URL params — single source of truth
	let urlLang = $derived(page.params?.lang || "fa");

	// Initialize i18n context (one-time, then $effect handles reactive sync)
	const i18n = setI18n(page.params?.lang || "fa");

	// Reactively sync i18n state whenever the URL lang param changes
	$effect(() => {
		i18n.syncFromUrl(urlLang);

		// Update <html> attributes to match
		if (browser) {
			const langInfo = supportedLanguages.find((l) => l.code === urlLang);
			document.documentElement.lang = urlLang;
			document.documentElement.dir = langInfo?.dir || "ltr";
		}
	});

	onMount(() => {
		theme.init();

		// Set initial HTML attributes
		const langInfo = supportedLanguages.find((l) => l.code === i18n.lang);
		document.documentElement.lang = i18n.lang;
		document.documentElement.dir = langInfo?.dir || "ltr";

		// Intercept external link clicks at document level (catches all <a> tags)
		document.addEventListener("click", handleExternalClick, true);
		return () =>
			document.removeEventListener("click", handleExternalClick, true);
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1, maximum-scale=1"
	/>
	<meta
		name="theme-color"
		content={theme.current === "dark" ? "#0f172a" : "#ffffff"}
	/>
	<link rel="icon" type="image/svg+xml" href="/icon.svg" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.toml" />
</svelte:head>

<SEO />

<div
	class="root-container"
	dir={(supportedLanguages.find((l) => l.code === i18n.lang)?.dir as
		| "ltr"
		| "rtl") || "ltr"}
>
	{@render children()}
	<Footer />
</div>

<ExternalLinkModal />

<style>
	.root-container {
		min-height: 100vh;
		background-color: var(--bg);
		color: var(--text);
	}
</style>
