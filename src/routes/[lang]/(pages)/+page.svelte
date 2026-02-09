<script lang="ts">
	import Stories from "$lib/components/Stories.svelte";
	import { getI18n } from "$lib/i18n.svelte";
	import { Sparkles } from "@lucide/svelte";
	import SEO from "$lib/components/SEO.svelte";

	let { data } = $props();
	const i18n = getI18n();

	let showStories = $state(false);

	// Docs come from SvelteKit's load function, which re-runs on URL navigation
	let displayDocs = $derived(data.docs);

	function openStories() {
		showStories = true;
	}

	function closeStories() {
		showStories = false;
	}
</script>

<SEO />

{#if showStories}
	<Stories onFinish={closeStories} />
{/if}

<div class="landing-page">
	<header class="hero">
		<div class="hero-badge">
			<Sparkles size={14} class="sparkle-icon" />
			{i18n.t("hero_badge")}
		</div>
		<h1>{@html i18n.t("hero_title")}</h1>
		<p class="subtitle">{i18n.t("hero_subtitle")}</p>

		<button class="minimal-btn" onclick={openStories}>
			<span class="pulse"></span>
			{i18n.t("hero_button")}
		</button>
	</header>

	<section class="docs-grid">
		{#each displayDocs as doc}
			<a href="/{data.lang}/docs/{doc.slug}" class="doc-card">
				<div class="card-content">
					<h2>{doc.meta?.title || doc.slug}</h2>
					<p>{doc.meta?.description || ""}</p>
				</div>
				<div class="card-footer">
					<span class="read-more">{i18n.t("read_more")}</span>
				</div>
			</a>
		{/each}
	</section>

	<section class="quick-intro">
		<div class="intro-box">
			<h2>{i18n.t("why_title")}</h2>
			<p>{i18n.t("why_content")}</p>
		</div>
	</section>
</div>

<style>
	.landing-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 6rem 2rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 6rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-badge {
		background: rgba(59, 130, 246, 0.08);
		color: #3b82f6;
		padding: 0.6rem 1.2rem;
		border-radius: 99px;
		font-size: 0.825rem;
		font-weight: 700;
		margin-bottom: 2rem;
		border: 1px solid rgba(59, 130, 246, 0.15);
		display: flex;
		align-items: center;
		gap: 0.6rem;
		backdrop-filter: blur(10px);
		letter-spacing: 0.02em;
		text-transform: uppercase;
		transition: all 0.3s ease;
	}

	:global([data-theme="dark"]) .hero-badge {
		background: linear-gradient(
			135deg,
			rgba(59, 130, 246, 0.1) 0%,
			rgba(45, 212, 191, 0.1) 100%
		);
		color: #60a5fa;
		border: 1px solid rgba(59, 130, 246, 0.2);
	}

	:global(.sparkle-icon) {
		color: #f59e0b;
		filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.3));
	}

	:global([data-theme="dark"]) :global(.sparkle-icon) {
		color: #fbbf24;
		filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
	}

	h1 {
		font-size: clamp(3rem, 8vw, 5rem);
		font-weight: 900;
		margin-bottom: 1.5rem;
		letter-spacing: -0.05em;
		line-height: 1.1;
	}

	:global(.accent) {
		background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	:global([data-theme="dark"]) :global(.accent) {
		background: linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%);
		-webkit-background-clip: text;
		background-clip: text;
	}

	.subtitle {
		font-size: 1.5rem;
		color: var(--text-muted);
		max-width: 800px;
		margin: 0 auto 3rem;
		line-height: 1.6;
	}

	.minimal-btn {
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.3);
		color: #3b82f6;
		padding: 1.25rem 3rem;
		border-radius: 99px;
		font-size: 1.25rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 1rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
	}

	.minimal-btn:hover {
		background: #3b82f6;
		color: white;
		transform: scale(1.05);
		box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.5);
	}

	.pulse {
		width: 12px;
		height: 12px;
		background: #3b82f6;
		border-radius: 50%;
		display: inline-block;
		animation: pulse 2s infinite;
	}

	.minimal-btn:hover .pulse {
		background: white;
	}

	@keyframes pulse {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
		}
		70% {
			transform: scale(1);
			box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
		}
		100% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
		}
	}

	.docs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 2.5rem;
		margin-bottom: 8rem;
	}

	.doc-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid var(--border);
		padding: 2.5rem;
		border-radius: 24px;
		text-decoration: none;
		transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(8px);
		position: relative;
		overflow: hidden;
	}

	:global([data-theme="light"]) .doc-card {
		background: #ffffff;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.05),
			0 2px 4px -1px rgba(0, 0, 0, 0.03);
	}

	.doc-card::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, #3b82f6, transparent);
		opacity: 0;
		transition: opacity 0.4s;
	}

	.doc-card:hover {
		transform: translateY(-8px) scale(1.02);
		border-color: var(--primary);
		background: rgba(255, 255, 255, 0.05);
		box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.2);
	}

	:global([data-theme="light"]) .doc-card:hover {
		background: #ffffff;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.doc-card:hover::before {
		opacity: 1;
	}

	.doc-card h2 {
		margin: 0 0 1.25rem;
		color: var(--text);
		font-size: 1.75rem;
		font-weight: 700;
	}

	.doc-card p {
		color: var(--text-muted);
		line-height: 1.7;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	.card-footer {
		margin-top: auto;
	}

	.read-more {
		color: #3b82f6;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1rem;
	}

	.quick-intro {
		border-top: 1px solid var(--border);
		padding-top: 8rem;
	}

	.intro-box {
		background: rgba(255, 255, 255, 0.03);
		padding: 4rem;
		border-radius: 32px;
		border: 1px solid var(--border);
		text-align: center;
		max-width: 900px;
		margin: 0 auto;
	}

	:global([data-theme="light"]) .intro-box {
		background: var(--bg-sidebar);
	}

	.intro-box h2 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: var(--text);
	}

	.intro-box p {
		font-size: 1.25rem;
		color: var(--text-muted);
		line-height: 1.8;
	}
</style>
