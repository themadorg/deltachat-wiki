<script lang="ts">
    import { onMount } from "svelte";

    let { class: className = "" } = $props<{ class?: string }>();

    let dots = $state<{ x: number; y: number; id: number }[]>([]);
    let paths = $state<{ from: number; to: number; id: number }[]>([]);
    let messages = $state<{ pathId: number; progress: number; id: number }[]>(
        [],
    );

    let nextId = 0;

    onMount(() => {
        // Generate random dots (nodes)
        for (let i = 0; i < 15; i++) {
            dots.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                id: nextId++,
            });
        }

        // Connect dots with paths
        for (let i = 0; i < dots.length; i++) {
            const connections = Math.floor(Math.random() * 2) + 1;
            for (let j = 0; j < connections; j++) {
                const targetIdx = Math.floor(Math.random() * dots.length);
                if (targetIdx !== i) {
                    paths.push({
                        from: dots[i].id,
                        to: dots[targetIdx].id,
                        id: nextId++,
                    });
                }
            }
        }

        const interval = setInterval(() => {
            if (messages.length < 8) {
                const pathIdx = Math.floor(Math.random() * paths.length);
                messages = [
                    ...messages,
                    { pathId: pathIdx, progress: 0, id: nextId++ },
                ];
            }
        }, 800);

        let lastTime = 0;
        const animate = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            messages = messages
                .map((m) => ({ ...m, progress: m.progress + dt * 0.4 }))
                .filter((m) => m.progress < 1);

            requestAnimationFrame(animate);
        };
        const animId = requestAnimationFrame(animate);

        return () => {
            clearInterval(interval);
            cancelAnimationFrame(animId);
        };
    });

    function getCoord(id: number) {
        const dot = dots.find((d) => d.id === id);
        return dot ? { x: dot.x, y: dot.y } : { x: 0, y: 0 };
    }
</script>

<div class="animation-container {className}">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <!-- Paths -->
        {#each paths as path (path.id)}
            {@const from = getCoord(path.from)}
            {@const to = getCoord(path.to)}
            <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                class="path-line"
            />
        {/each}

        <!-- Messages -->
        {#each messages as msg (msg.id)}
            {@const path = paths[msg.pathId]}
            {@const from = getCoord(path.from)}
            {@const to = getCoord(path.to)}
            {@const x = from.x + (to.x - from.x) * msg.progress}
            {@const y = from.y + (to.y - from.y) * msg.progress}
            <circle cx={x} cy={y} r="0.8" class="message-dot" />
        {/each}

        <!-- Nodes -->
        {#each dots as dot (dot.id)}
            <circle cx={dot.x} cy={dot.y} r="1.5" class="node-dot" />
        {/each}
    </svg>
</div>

<style>
    .animation-container {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        opacity: 0.4;
        z-index: -1;
        pointer-events: none;
    }

    svg {
        width: 100%;
        height: 100%;
    }

    .path-line {
        stroke: var(--primary);
        stroke-width: 0.1;
        stroke-opacity: 0.3;
    }

    .node-dot {
        fill: var(--primary);
        opacity: 0.4;
    }

    .message-dot {
        fill: var(--primary);
        filter: drop-shadow(0 0 3px var(--primary));
    }
</style>
