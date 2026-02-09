<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { getI18n } from "$lib/i18n.svelte";
	import { X } from "@lucide/svelte";
	import introImg from "$lib/assets/stories/intro.png";
	import privacyImg from "$lib/assets/stories/privacy.png";
	import networkImg from "$lib/assets/stories/network.png";

	let { onFinish } = $props();
	const i18n = getI18n();

	const storyAssets = [introImg, privacyImg, networkImg, introImg];
	const storyColors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

	const stories = $derived(
		(i18n.t("stories") as any[]).map((s, i) => ({
			...s,
			image: storyAssets[i],
			color: storyColors[i],
		})),
	);

	let currentIndex = $state(0);
	let progress = $state(0);
	let paused = $state(false);
	let interval: any;

	const STORY_DURATION = 5000;
	const UPDATE_INTERVAL = 50;

	// Swipe tracking
	let touchStartY = $state(0);
	let touchEndY = $state(0);
	let touchStartX = $state(0);

	function startStory() {
		stopStory();
		progress = 0;
		interval = setInterval(() => {
			if (!paused) {
				progress += (UPDATE_INTERVAL / STORY_DURATION) * 100;
				if (progress >= 100) {
					nextStory();
				}
			}
		}, UPDATE_INTERVAL);
	}

	function stopStory() {
		if (interval) clearInterval(interval);
	}

	function nextStory() {
		if (currentIndex < stories.length - 1) {
			currentIndex++;
			progress = 0;
		} else {
			closeWithAnimation();
		}
	}

	function prevStory() {
		if (currentIndex > 0) {
			currentIndex--;
			progress = 0;
		}
	}

	let isClosing = $state(false);
	function closeWithAnimation() {
		isClosing = true;
		stopStory();
		setTimeout(() => {
			onFinish?.();
		}, 400);
	}

	function handleTouchStart(e: TouchEvent) {
		paused = true;
		touchStartY = e.touches[0].clientY;
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		paused = false;
		touchEndY = e.changedTouches[0].clientY;
		const deltaY = touchEndY - touchStartY;
		const deltaX = e.changedTouches[0].clientX - touchStartX;

		// Swipe Up or Down to close
		if (Math.abs(deltaY) > 100 && Math.abs(deltaY) > Math.abs(deltaX)) {
			closeWithAnimation();
			return;
		}

		// Since it's RTL (Persian):
		// Right click (positive deltaX or right side) -> Previous
		// Left click (negative deltaX or left side) -> Next
		// But usually we just use tap positions. Let's stick to tap position for easier UX.
	}

	function handleTap(e: MouseEvent | TouchEvent) {
		const clientX =
			"touches" in e ? e.changedTouches[0].clientX : e.clientX;
		const width = window.innerWidth;

		// RTL logic:
		// Right 50% -> Previous
		// Left 50% -> Next
		if (clientX > width / 2) {
			prevStory();
		} else {
			nextStory();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "ArrowRight") prevStory();
		if (e.key === "ArrowLeft") nextStory();
		if (e.key === "Escape") closeWithAnimation();
	}

	onMount(() => {
		startStory();
		window.addEventListener("keydown", handleKeydown);
	});

	onDestroy(() => {
		stopStory();
		window.removeEventListener("keydown", handleKeydown);
	});
</script>

{#if !isClosing}
	<div
		class="stories-overlay"
		role="presentation"
		transition:fly={{ y: 1000, duration: 400 }}
		onmousedown={() => (paused = true)}
		onmouseup={(e) => {
			paused = false;
			handleTap(e);
		}}
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
		onclick={(e) => handleTap(e)}
	>
		<div class="story-container">
			<!-- Progress Bars -->
			<div class="progress-container">
				{#each stories as _, i}
					<div class="progress-track">
						<div
							class="progress-fill"
							style="width: {i < currentIndex
								? '100%'
								: i === currentIndex
									? progress + '%'
									: '0%'}"
						></div>
					</div>
				{/each}
			</div>

			<!-- Story Content -->
			{#key currentIndex}
				<div class="story-slide" in:fade={{ duration: 300 }}>
					<img
						src={stories[currentIndex].image}
						alt={stories[currentIndex].title}
						class="story-bg"
					/>
					<div
						class="story-gradient"
						style="background: linear-gradient(to bottom, transparent 40%, {stories[
							currentIndex
						].color}ee 100%)"
					></div>

					<div
						class="story-text"
						in:fly={{ y: 20, duration: 400, delay: 200 }}
					>
						<h2>{stories[currentIndex].title}</h2>
						<p>{stories[currentIndex].description}</p>
					</div>
				</div>
			{/key}

			<button
				class="close-btn"
				onclick={(e) => {
					e.stopPropagation();
					closeWithAnimation();
				}}><X size={24} /></button
			>
		</div>
	</div>
{/if}

<style>
	.stories-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: black;
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
		touch-action: none;
	}

	/* Only show on mobile */
	@media (min-width: 768px) {
		.stories-overlay {
			display: none;
		}
	}

	.story-container {
		position: relative;
		width: 100%;
		height: 100%;
		max-width: 450px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.progress-container {
		position: absolute;
		top: 20px;
		inset-inline: 10px;
		display: flex;
		gap: 6px;
		z-index: 100;
	}

	.progress-track {
		flex: 1;
		height: 3px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: white;
		transition: width 0.05s linear;
	}

	.story-slide {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
	}

	.story-bg {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.story-gradient {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 60%;
		z-index: 5;
	}

	.story-text {
		position: absolute;
		bottom: 80px;
		inset-inline: 30px;
		z-index: 10;
		text-align: start;
		color: white;
	}

	.story-text h2 {
		font-size: 2.25rem;
		font-weight: 900;
		margin-bottom: 1rem;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	}

	.story-text p {
		font-size: 1.25rem;
		line-height: 1.6;
		font-weight: 500;
		text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
	}

	.close-btn {
		position: absolute;
		top: 40px;
		inset-inline-end: 20px;
		background: rgba(0, 0, 0, 0.2);
		border: none;
		color: white;
		font-size: 2rem;
		z-index: 101;
		cursor: pointer;
		opacity: 0.7;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
