<script lang="ts">
    let { score, size = 100, stroke = 8 }: { score: number; size?: number; stroke?: number } = $props();

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
</script>

<div class="score-ring" style="--score: {score}; width: {size}px; height: {size}px;">
    <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle class="ring-bg" cx="60" cy="60" r={radius} stroke-width={stroke} />
        <circle
            class="ring-fill"
            cx="60"
            cy="60"
            r={radius}
            stroke-width={stroke}
            style="stroke-dasharray: {circumference}; stroke-dashoffset: calc({circumference} - ({circumference} * var(--score)) / 100)"
        />
    </svg>
    <div class="score-value">
        <span class="score-number" style="font-size: {size * 0.22}px">{score}</span>
        <span class="score-percent" style="font-size: {size * 0.11}px">%</span>
    </div>
</div>

<style>
    .score-ring {
        position: relative;
        flex-shrink: 0;
    }

    .score-ring svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }

    .ring-bg {
        fill: none;
        stroke: var(--border);
    }

    .ring-fill {
        fill: none;
        stroke: var(--primary);
        stroke-linecap: round;
        transition: stroke-dashoffset 0.5s ease;
    }

    .score-value {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.05rem;
    }

    .score-number {
        font-weight: 800;
        color: var(--text);
        line-height: 1;
    }

    .score-percent {
        font-weight: 700;
        color: var(--text-muted);
        margin-top: 0.15em;
    }
</style>
