<script lang="ts">
	import LucideIcon from "./LucideIcon.svelte";
	let { title, icon, children } = $props();
</script>

<div class="feature-card">
	<div class="header">
		<div class="icon-wrapper">
			<span class="icon">
				{#if typeof icon === "string" && icon.length > 2}
					<LucideIcon name={icon} size={20} />
				{:else}
					{icon}
				{/if}
			</span>
		</div>
		<h3 class="title">{title}</h3>
	</div>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style>
	.feature-card {
		background: rgba(59, 130, 246, 0.05);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 2.25rem;
		margin: 2.5rem 0;
		transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
		position: relative;
		overflow: hidden;
	}

	:global([data-theme="light"]) .feature-card {
		background: #ffffff;
		border-color: rgba(0, 0, 0, 0.05);
		box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
	}

	.feature-card::after {
		content: "";
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at bottom right,
			rgba(59, 130, 246, 0.05),
			transparent 300px
		);
		pointer-events: none;
		z-index: 1;
	}

	:global([data-theme="light"]) .feature-card::after {
		background: radial-gradient(
			circle at bottom right,
			rgba(59, 130, 246, 0.03),
			transparent 300px
		);
	}

	:global([dir="rtl"]) .feature-card::after {
		background: radial-gradient(
			circle at bottom left,
			rgba(59, 130, 246, 0.05),
			transparent 300px
		);
	}

	.header,
	.content {
		position: relative;
		z-index: 2;
		text-align: start;
	}

	.feature-card:hover {
		transform: translateY(-6px);
		border-color: var(--primary);
		box-shadow: 0 20px 40px -20px rgba(59, 130, 246, 0.2);
	}

	:global([data-theme="light"]) .feature-card:hover {
		background: #ffffff;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
		border-color: var(--primary);
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.icon-wrapper {
		background: var(--primary);
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border-radius: 12px;
		color: var(--primary-fg);
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.content {
		color: var(--text-muted);
		line-height: 1.7;
		font-size: 1.05rem;
	}
</style>
