<script lang="ts">
	import { getI18n } from "$lib/i18n.svelte";
	import { getRawDoc } from "$lib/docs";
	import { copyToClipboard } from "$lib/clipboard";
	import { page } from "$app/state";
	import LucideIcon from "$lib/components/LucideIcon.svelte";

	import { browser } from "$app/environment";

	let { data } = $props();
	const i18n = getI18n();

	let docContent = $state<any>(null);
	let meta = $state<any>({});
	let rawMarkdown = $state<string | null>(null);
	let isMarkdownMode = $derived(
		browser ? page.url.searchParams.has("markdown") : false,
	);

	// Update content when data changes (from server side or navigation)
	$effect(() => {
		if (data.content) {
			docContent = data.content;
			meta = data.meta || {};
		}
	});

	// Fetch raw markdown if in markdown mode
	$effect(() => {
		if (isMarkdownMode && data.slug) {
			getRawDoc(data.slug, i18n.lang).then((raw) => {
				rawMarkdown = raw;
			});
		}
	});

	// Click to copy logic for both code blocks and inline code
	$effect(() => {
		const handleClick = async (e: MouseEvent) => {
			const target = e.target as HTMLElement;

			// Handle copy button in code blocks (Base64 encoded)
			const copyBtn = target.closest(".copy-code-btn") as HTMLElement;
			if (copyBtn) {
				const base64 = copyBtn.getAttribute("data-code");
				if (base64) {
					try {
						const decodedCode = atob(base64);
						await copyToClipboard(decodedCode);
						const originalText = copyBtn.innerText;
						copyBtn.innerText = i18n.t("copied") || "Copied!";
						copyBtn.classList.add("success");
						setTimeout(() => {
							copyBtn.innerText = originalText;
							copyBtn.classList.remove("success");
						}, 2000);
					} catch (err) {
						console.error("Failed to copy!", err);
					}
				}
				return;
			}

			// Handle inline code click-to-copy
			if (
				target.tagName === "CODE" &&
				target.parentElement?.tagName !== "PRE" &&
				!target.closest(".no-copy")
			) {
				try {
					await copyToClipboard(target.innerText);
					target.classList.add("copied-flash");
					setTimeout(() => {
						target.classList.remove("copied-flash");
					}, 600);
				} catch (err) {
					console.error("Failed to copy!", err);
				}
			}
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	});
</script>

<svelte:head>
	<title>{meta.title || "Docs"} - {i18n.t("site_title")}</title>
	<meta name="description" content={meta.description || ""} />
</svelte:head>

<article class="prose doc-content-article">
	{#if isMarkdownMode}
		{#if rawMarkdown}
			<div class="markdown-raw-view">
				<div class="raw-header">
					<span>Markdown View</span>
					<button
						class="close-raw"
						onclick={() => {
							const url = new URL(page.url);
							url.searchParams.delete("markdown");
							window.location.href = url.toString();
						}}>Close</button
					>
				</div>
				<pre><code>{rawMarkdown}</code></pre>
			</div>
		{:else}
			<div class="loading-doc">
				<p>Loading raw markdown...</p>
			</div>
		{/if}
	{:else if docContent}
		{@const Doc = docContent}
		<Doc />
	{:else}
		<div class="loading-doc">
			<p>Loading document...</p>
		</div>
	{/if}

	{#if !isMarkdownMode && data.pagination}
		<div class="pagination-nav">
			{#if data.pagination.prev}
				<a
					href="/{i18n.lang}/docs/{data.pagination.prev.slug}"
					class="pagination-link prev"
				>
					<div class="icon-wrapper">
						<LucideIcon
							name={i18n.dir === "rtl"
								? "ChevronRight"
								: "ChevronLeft"}
							size={20}
						/>
					</div>
					<div class="text-wrapper">
						<span class="label"
							>{i18n.t("pagination_previous")}</span
						>
						<span class="title">{data.pagination.prev.title}</span>
					</div>
				</a>
			{:else}
				<div class="pagination-spacer"></div>
			{/if}

			{#if data.pagination.next}
				<a
					href="/{i18n.lang}/docs/{data.pagination.next.slug}"
					class="pagination-link next"
				>
					<div class="text-wrapper">
						<span class="label">{i18n.t("pagination_next")}</span>
						<span class="title">{data.pagination.next.title}</span>
					</div>
					<div class="icon-wrapper">
						<LucideIcon
							name={i18n.dir === "rtl"
								? "ChevronLeft"
								: "ChevronRight"}
							size={20}
						/>
					</div>
				</a>
			{/if}
		</div>
	{/if}
</article>

<style>
	.doc-content-article {
		width: 100%;
		max-width: 100%;
		animation: fadeIn 0.4s ease-out;
	}

	.loading-doc {
		display: flex;
		justify-content: center;
		padding: 4rem;
		color: var(--text-muted);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.prose) {
		color: var(--text);
		font-size: 1rem;
		line-height: 1.75;
		--tw-prose-body: var(--text);
		--tw-prose-headings: var(--text);
		--tw-prose-lead: var(--text-muted);
		--tw-prose-links: var(--primary);
		--tw-prose-bold: var(--text);
		--tw-prose-counters: var(--text-muted);
		--tw-prose-bullets: var(--text-muted);
		--tw-prose-hr: var(--border);
		--tw-prose-quotes: var(--text);
		--tw-prose-quote-borders: var(--primary);
		--tw-prose-captions: var(--text-muted);
		--tw-prose-code: var(--primary);
		--tw-prose-pre-code: var(--text);
		--tw-prose-pre-bg: var(--bg-sidebar);
		--tw-prose-th-borders: var(--border);
		--tw-prose-td-borders: var(--border);
	}

	:global(.prose h1) {
		color: var(--text);
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 2rem;
		letter-spacing: -0.025em;
	}

	:global(.prose h2) {
		color: var(--text);
		font-size: 1.75rem;
		font-weight: 700;
		margin-top: 3rem;
		margin-bottom: 1.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	:global(.prose h3) {
		color: var(--text);
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	:global(.prose p) {
		margin-bottom: 1.5rem;
	}

	:global(.prose strong) {
		color: var(--text);
		font-weight: 600;
	}

	:global(.prose ul, .prose ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	:global(.prose li) {
		margin-bottom: 0.5rem;
	}

	:global(.prose blockquote) {
		border-inline-start: 4px solid var(--primary);
		padding: 1.25rem 1.5rem;
		margin: 2.5rem 0;
		background: rgba(var(--primary-rgb), 0.08); /* More tinted background */
		border-radius: 0 12px 12px 0;
		color: var(--text);
		box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.1);
	}

	:global([dir="rtl"] .prose blockquote) {
		border-radius: 12px 0 0 12px;
	}

	:global(.prose blockquote p) {
		margin-bottom: 0 !important;
		font-style: italic;
		line-height: 1.6;
		opacity: 1; /* Ensure full opacity for text */
	}

	:global(.prose a) {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-thickness: 1px;
		transition: all 0.2s;
	}

	:global(.prose a:hover) {
		color: var(--accent);
		text-decoration-thickness: 2px;
	}

	/* Table styles inspired by Anaconda */
	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		font-size: 0.875rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}

	:global(.prose th) {
		background: rgba(120, 120, 120, 0.05);
		color: var(--text-muted);
		font-weight: 600;
		text-align: left;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
	}

	:global(.prose td) {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		color: var(--text);
	}

	:global(.prose tr:last-child td) {
		border-bottom: none;
	}

	:global(.prose tr:nth-child(even)) {
		background: rgba(120, 120, 120, 0.02);
	}

	/* Code blocks - Anaconda Style */
	:global(.code-block-container) {
		background: #1c1e22;
		border-radius: 12px;
		border: 1px solid var(--border);
		margin: 2rem 0;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		direction: ltr;
		text-align: left;
	}

	:global(.code-block-header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-bottom: 1px solid var(--border);
		font-family: inherit;
	}

	:global(.code-lang) {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--text-muted);
		letter-spacing: 0.05em;
	}

	:global(.copy-code-btn) {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--border);
		color: var(--text-muted);
		padding: 0.25rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	:global(.copy-code-btn:hover) {
		background: var(--primary);
		color: var(--primary-fg);
		border-color: var(--primary);
	}

	:global(.copy-code-btn.success) {
		background: #10b981;
		color: white;
		border-color: #10b981;
	}

	:global(.code-block-content pre) {
		margin: 0 !important;
		background: transparent !important;
		padding: 1.25rem !important;
		border-radius: 0 !important;
		border: none !important;
		overflow-x: auto !important;
		direction: ltr !important;
		text-align: left !important;
	}

	:global(.code-block-content code) {
		font-family: "Fira Code", "JetBrains Mono", monospace !important;
		font-size: 0.875rem !important;
		line-height: 1.6 !important;
	}

	/* Inline code - Click to copy style */
	:global(.prose :not(pre) > code) {
		background: rgba(var(--primary-rgb), 0.1);
		padding: 0.2rem 0.4rem;
		border-radius: 6px;
		color: var(--primary);
		font-size: 0.875rem;
		font-family: "Fira Code", monospace;
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid rgba(var(--primary-rgb), 0.1);
		position: relative;
		direction: ltr;
		unicode-bidi: embed;
	}

	:global(.prose :not(pre) > code:hover) {
		background: rgba(var(--primary-rgb), 0.2);
		border-color: rgba(var(--primary-rgb), 0.3);
	}

	:global(.prose :not(pre) > code.copied-flash) {
		background: var(--primary) !important;
		color: var(--primary-fg) !important;
		transform: scale(1.05);
	}

	/* Remove default backticks from Tailwind Typography */
	:global(.prose code::before),
	:global(.prose code::after) {
		content: none !important;
	}

	/* Force all code to LTR even in RTL pages */
	:global(.prose pre) {
		direction: ltr !important;
		text-align: left !important;
	}

	.markdown-raw-view {
		background: var(--bg-sidebar);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 0;
		overflow: hidden;
		margin-bottom: 2rem;
	}

	.raw-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 1.25rem;
		background: rgba(120, 120, 120, 0.05);
		border-bottom: 1px solid var(--border);
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.close-raw {
		background: var(--primary);
		color: var(--primary-fg);
		border: none;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.markdown-raw-view pre {
		margin: 0;
		padding: 1.5rem;
		background: transparent;
		border: none;
		border-radius: 0;
	}

	.markdown-raw-view code {
		white-space: pre-wrap;
		word-break: break-all;
	}

	/* Pagination Styles */
	.pagination-nav {
		display: flex;
		justify-content: space-between;
		gap: 1.5rem;
		margin-top: 5rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.pagination-link {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
		padding: 1.25rem;
		border-radius: 12px;
		border: 1px solid var(--border);
		text-decoration: none !important;
		background: rgba(var(--primary-rgb), 0.03);
		transition: all 0.2s ease;
		max-width: 50%;
	}

	.pagination-link:hover {
		border-color: var(--primary);
		background: rgba(var(--primary-rgb), 0.08);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.pagination-link.next {
		text-align: end;
		justify-content: flex-end;
		margin-inline-start: auto;
	}

	.icon-wrapper {
		color: var(--primary);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.pagination-link.prev:hover .icon-wrapper {
		transform: translateX(-4px);
	}
	:global([dir="rtl"]) .pagination-link.prev:hover .icon-wrapper {
		transform: translateX(4px);
	}

	.pagination-link.next:hover .icon-wrapper {
		transform: translateX(4px);
	}
	:global([dir="rtl"]) .pagination-link.next:hover .icon-wrapper {
		transform: translateX(-4px);
	}

	.text-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		overflow: hidden;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	.title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pagination-spacer {
		flex: 1;
	}

	@media (max-width: 640px) {
		.pagination-nav {
			flex-direction: column;
		}
		.pagination-link {
			max-width: 100%;
		}
		.pagination-spacer {
			display: none;
		}
	}
</style>
