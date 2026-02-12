<script lang="ts">
	import Stories from "$lib/components/Stories.svelte";
	import { getI18n } from "$lib/i18n.svelte";
	import {
		Sparkles,
		Shield,
		Share2,
		Globe,
		Box,
		ArrowRight,
	} from "@lucide/svelte";
	import SEO from "$lib/components/SEO.svelte";
	import HeroAnimation from "$lib/components/HeroAnimation.svelte";

	let { data } = $props();
	const i18n = getI18n();

	let showStories = $state(false);

	// Docs come from SvelteKit's load function, which re-runs on URL navigation
	let displayDocs = $derived(data.docs || []);

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

<div class="hero-bg">
	<HeroAnimation />
</div>

<div class="landing-page">
	<header class="hero">
		<div class="hero-content">
			<div class="hero-badge">
				<Sparkles size={14} class="sparkle-icon" />
				{i18n.t("hero_badge")}
			</div>
			<h1>{@html i18n.t("hero_title")}</h1>
			<p class="subtitle">{i18n.t("hero_subtitle")}</p>

			<div class="hero-actions">
				<a
					href="/{data.lang}/docs/general/introduction"
					class="primary-btn"
				>
					{i18n.t("hero_button")}
					<ArrowRight size={20} />
				</a>
				<button class="minimal-btn" onclick={openStories}>
					<span class="pulse"></span>
					{i18n.t("hero_button_stories") || "Quick Overview"}
				</button>
			</div>
		</div>
	</header>

	<div class="below-hero">
		<section class="features-grid">
			<div class="feature-card">
				<div class="icon-box"><Share2 /></div>
				<h3>{i18n.t("feature_decentralized_title")}</h3>
				<p>{i18n.t("feature_decentralized_desc")}</p>
			</div>
			<div class="feature-card">
				<div class="icon-box"><Shield /></div>
				<h3>{i18n.t("feature_encryption_title")}</h3>
				<p>{i18n.t("feature_encryption_desc")}</p>
			</div>
			<div class="feature-card">
				<div class="icon-box"><Globe /></div>
				<h3>{i18n.t("feature_universal_title")}</h3>
				<p>{i18n.t("feature_universal_desc")}</p>
			</div>
			<div class="feature-card">
				<div class="icon-box"><Box /></div>
				<h3>{i18n.t("feature_webxdc_title")}</h3>
				<p>{i18n.t("feature_webxdc_desc")}</p>
			</div>
		</section>

		<section class="docs-section">
			<div class="section-header">
				<h2>{i18n.t("doc_title")}</h2>
				<p>{i18n.t("why_content")}</p>
			</div>

			<div class="docs-grid">
				{#each displayDocs.slice(0, 6) as doc}
					<a href="/{data.lang}/docs/{doc.slug}" class="doc-card">
						<div class="card-content">
							<h3>{doc.meta?.title || doc.slug}</h3>
							<p>
								{doc.meta?.description || i18n.t("read_more")}
							</p>
						</div>
						<div class="card-footer">
							<span class="read-more">{i18n.t("read_more")}</span>
						</div>
					</a>
				{/each}
			</div>

			<div class="all-docs-btn-container">
				<a
					href="/{data.lang}/docs/general/introduction"
					class="outline-btn"
				>
					View All Documentation
				</a>
			</div>
		</section>
	</div>
</div>

<style>
	.hero-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.landing-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem 8rem;
		overflow-x: hidden;
		position: relative;
		z-index: 1;
	}

	.hero {
		min-height: 85vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: relative;
		margin-bottom: 0;
	}

	.below-hero {
		background: var(--bg);
		position: relative;
		z-index: 2;
		padding-top: 4rem;
		margin-left: calc(-50vw + 50%);
		margin-right: calc(-50vw + 50%);
		padding-left: calc(50vw - 50%);
		padding-right: calc(50vw - 50%);
	}

	.hero-content {
		max-width: 900px;
		z-index: 1;
		padding: 2rem;
		animation: fadeIn 1s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		backdrop-filter: blur(10px);
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	:global([data-theme="dark"]) .hero-badge {
		background: rgba(59, 130, 246, 0.15);
		color: #60a5fa;
	}

	h1 {
		font-size: clamp(3.5rem, 10vw, 6rem);
		font-weight: 900;
		margin-bottom: 2rem;
		letter-spacing: -0.04em;
		line-height: 0.95;
		color: var(--text);
	}

	:global(.accent) {
		background: linear-gradient(135deg, #2563eb 0%, #0d9488 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		font-size: clamp(1.25rem, 3vw, 1.75rem);
		color: var(--text-muted);
		max-width: 700px;
		margin: 0 auto 3.5rem;
		line-height: 1.5;
	}

	.hero-actions {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.primary-btn {
		background: var(--primary);
		color: white;
		padding: 1.25rem 2.5rem;
		border-radius: 16px;
		font-size: 1.25rem;
		font-weight: 700;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
	}

	.primary-btn:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 35px -10px rgba(59, 130, 246, 0.5);
	}

	.minimal-btn {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--border);
		color: var(--text);
		padding: 1.25rem 2.5rem;
		border-radius: 16px;
		font-size: 1.25rem;
		font-weight: 700;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 1rem;
		transition: all 0.3s ease;
	}

	.minimal-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: var(--primary);
	}

	.pulse {
		width: 12px;
		height: 12px;
		background: var(--primary);
		border-radius: 50%;
		animation: pulse 2s infinite;
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

	/* Features Section */
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		margin-bottom: 10rem;
	}

	.feature-card {
		background: var(--bg-sidebar);
		padding: 3rem 2rem;
		border-radius: 32px;
		border: 1px solid var(--border);
		transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
		position: relative;
		overflow: hidden;
	}

	.feature-card:hover {
		transform: translateY(-10px);
		border-color: var(--primary);
		box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.15);
	}

	.icon-box {
		width: 60px;
		height: 60px;
		background: rgba(59, 130, 246, 0.1);
		color: var(--primary);
		border-radius: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.feature-card h3 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.feature-card p {
		color: var(--text-muted);
		line-height: 1.6;
		font-size: 1.1rem;
	}

	/* Docs Section */
	.docs-section {
		padding: 4rem 0;
	}

	.section-header {
		text-align: center;
		margin-bottom: 5rem;
	}

	.section-header h2 {
		font-size: 3rem;
		font-weight: 900;
		margin-bottom: 1.5rem;
	}

	.section-header p {
		font-size: 1.25rem;
		color: var(--text-muted);
		max-width: 800px;
		margin: 0 auto;
	}

	.docs-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;
	}

	.doc-card {
		background: var(--bg-sidebar);
		padding: 2.5rem;
		border-radius: 24px;
		border: 1px solid var(--border);
		text-decoration: none;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	.doc-card:hover {
		border-color: var(--primary);
		transform: scale(1.02);
	}

	.doc-card h3 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.doc-card p {
		color: var(--text-muted);
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.read-more {
		color: var(--primary);
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.all-docs-btn-container {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}

	.outline-btn {
		border: 2px solid var(--border);
		color: var(--text);
		padding: 1rem 2.5rem;
		border-radius: 12px;
		text-decoration: none;
		font-weight: 700;
		transition: all 0.3s ease;
	}

	.outline-btn:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	@media (max-width: 768px) {
		.hero-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.landing-page {
			padding: 0 1.5rem 4rem;
		}

		h1 {
			font-size: 3rem;
		}
	}
</style>
