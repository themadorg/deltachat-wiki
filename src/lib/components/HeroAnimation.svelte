<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";

    let canvas: HTMLCanvasElement;

    onMount(() => {
        if (!browser) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let w = 0;
        let h = 0;
        let animId = 0;
        let dpr = window.devicePixelRatio || 1;

        // --- Config (adaptive based on device) ---
        const cores = navigator.hardwareConcurrency || 4;
        const perfTier = cores >= 8 ? 2 : cores >= 4 ? 1 : 0; // high, mid, low

        const SERVER_COUNT = [6, 8, 12][perfTier];
        const USER_COUNT = [20, 30, 45][perfTier];
        const MAX_DIST_SERVER = 300;
        const MAX_DIST_USER = 180;
        const MSG_SPEED = 0.004;
        const MSG_SPAWN_RATE = 0.005;

        const SERVER_RADIUS = 6;
        const USER_RADIUS = 2.5;
        const MSG_RADIUS = 2;
        const MAX_MSGS = [25, 40, 60][perfTier];

        // Colors — theme-aware
        function getTheme(): string {
            return (
                document.documentElement.getAttribute("data-theme") || "dark"
            );
        }
        let currentTheme = getTheme();

        function colors() {
            if (currentTheme === "light") {
                return {
                    server: [148, 163, 184] as [number, number, number], // slate-400 gray
                    user: [255, 0, 0] as [number, number, number], // 🔴 قرمز جیغ
                    msg: [5, 150, 105] as [number, number, number], // emerald-600
                };
            }
            return {
                server: [99, 102, 241] as [number, number, number], // indigo
                user: [148, 163, 184] as [number, number, number], // slate
                msg: [34, 197, 94] as [number, number, number], // green
            };
        }
        let clr = colors();

        // Watch for theme changes
        const themeObserver = new MutationObserver(() => {
            const newTheme = getTheme();
            if (newTheme !== currentTheme) {
                currentTheme = newTheme;
                clr = colors();
            }
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });

        // --- State ---
        type NodeType = "server" | "user";

        interface Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
            pulse: number;
            type: NodeType;
        }

        interface Msg {
            fromIdx: number;
            toIdx: number;
            t: number;
        }

        let nodes: Node[] = [];
        let msgs: Msg[] = [];

        function resize() {
            w = window.innerWidth;
            // Use the hero section height (grandparent of canvas)
            const hero = canvas.closest(".hero");
            h = hero ? hero.getBoundingClientRect().height : window.innerHeight;
            dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function initNodes() {
            nodes = [];
            const pad = 40;

            // Servers — spread out more evenly
            for (let i = 0; i < SERVER_COUNT; i++) {
                nodes.push({
                    x: pad + Math.random() * (w - pad * 2),
                    y: pad + Math.random() * (h - pad * 2),
                    vx: 0,
                    vy: 0,
                    pulse: Math.random() * Math.PI * 2,
                    type: "server",
                });
            }

            // Users — scattered around
            for (let i = 0; i < USER_COUNT; i++) {
                nodes.push({
                    x: pad + Math.random() * (w - pad * 2),
                    y: pad + Math.random() * (h - pad * 2),
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    pulse: Math.random() * Math.PI * 2,
                    type: "user",
                });
            }
        }

        function draw() {
            if (!ctx) return;
            ctx.clearRect(0, 0, w, h);

            const [sr, sg, sb] = clr.server;
            const [ur, ug, ub] = clr.user;
            const [mr, mg, mb] = clr.msg;

            // Update positions
            for (const n of nodes) {
                n.x += n.vx;
                n.y += n.vy;
                n.pulse += 0.015;

                if (n.x < 10 || n.x > w - 10) n.vx *= -1;
                if (n.y < 10 || n.y > h - 10) n.vy *= -1;
                n.x = Math.max(5, Math.min(w - 5, n.x));
                n.y = Math.max(5, Math.min(h - 5, n.y));
            }

            // Build edges
            const edges: [number, number][] = [];

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const ni = nodes[i];
                    const nj = nodes[j];
                    const dx = ni.x - nj.x;
                    const dy = ni.y - nj.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Determine max distance based on node types
                    let maxDist = MAX_DIST_USER;
                    if (ni.type === "server" && nj.type === "server") {
                        maxDist = MAX_DIST_SERVER;
                    } else if (ni.type === "server" || nj.type === "server") {
                        maxDist = MAX_DIST_USER;
                    } else {
                        // user-to-user: no direct connection
                        continue;
                    }

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.18;
                        // Use server color for lines
                        ctx.beginPath();
                        ctx.moveTo(ni.x, ni.y);
                        ctx.lineTo(nj.x, nj.y);
                        ctx.strokeStyle = `rgba(${sr},${sg},${sb},${alpha})`;
                        ctx.lineWidth =
                            ni.type === "server" && nj.type === "server"
                                ? 1.2
                                : 0.7;
                        ctx.stroke();
                        edges.push([i, j]);
                    }
                }
            }

            // Spawn messages
            for (const [a, b] of edges) {
                if (Math.random() < MSG_SPAWN_RATE && msgs.length < MAX_MSGS) {
                    if (Math.random() > 0.5) {
                        msgs.push({ fromIdx: a, toIdx: b, t: 0 });
                    } else {
                        msgs.push({ fromIdx: b, toIdx: a, t: 0 });
                    }
                }
            }

            // Draw & update messages (green)
            msgs = msgs.filter((m) => {
                m.t += MSG_SPEED;
                if (m.t > 1) return false;

                const from = nodes[m.fromIdx];
                const to = nodes[m.toIdx];
                const x = from.x + (to.x - from.x) * m.t;
                const y = from.y + (to.y - from.y) * m.t;

                // Glow (only in dark mode)
                if (currentTheme !== "light") {
                    const glowSize = MSG_RADIUS * 5;
                    const glow = ctx!.createRadialGradient(
                        x,
                        y,
                        0,
                        x,
                        y,
                        glowSize,
                    );
                    glow.addColorStop(0, `rgba(${mr},${mg},${mb},0.5)`);
                    glow.addColorStop(0.5, `rgba(${mr},${mg},${mb},0.1)`);
                    glow.addColorStop(1, `rgba(${mr},${mg},${mb},0)`);
                    ctx!.beginPath();
                    ctx!.arc(x, y, glowSize, 0, Math.PI * 2);
                    ctx!.fillStyle = glow;
                    ctx!.fill();
                }

                // Core
                ctx!.beginPath();
                ctx!.arc(x, y, MSG_RADIUS, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(${mr},${mg},${mb},0.9)`;
                ctx!.fill();

                return true;
            });

            // Draw nodes
            for (const n of nodes) {
                const isServer = n.type === "server";
                const baseR = isServer ? SERVER_RADIUS : USER_RADIUS;
                const [cr, cg, cb] = isServer ? clr.server : clr.user;
                const pulseScale =
                    1 + Math.sin(n.pulse) * (isServer ? 0.1 : 0.08);
                const r = baseR * pulseScale;

                // Glow (only in dark mode)
                if (currentTheme !== "light") {
                    const glowSize = r * (isServer ? 5 : 3);
                    const glow = ctx.createRadialGradient(
                        n.x,
                        n.y,
                        0,
                        n.x,
                        n.y,
                        glowSize,
                    );
                    glow.addColorStop(
                        0,
                        `rgba(${cr},${cg},${cb},${isServer ? 0.35 : 0.2})`,
                    );
                    glow.addColorStop(0.4, `rgba(${cr},${cg},${cb},0.06)`);
                    glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, glowSize, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();
                }

                // Core
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${cr},${cg},${cb},${isServer ? 0.7 : 0.45})`;
                ctx.fill();
            }

            animId = requestAnimationFrame(draw);
        }

        resize();
        initNodes();
        animId = requestAnimationFrame(draw);

        const onResize = () => {
            resize();
            initNodes();
            msgs = [];
        };
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
            themeObserver.disconnect();
        };
    });
</script>

<div class="hero-canvas-wrap">
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .hero-canvas-wrap {
        position: absolute;
        inset: 0;
        overflow: hidden;
        opacity: 0.5;
        z-index: 0;
        pointer-events: none;
    }

    canvas {
        display: block;
        width: 100%;
        height: 100%;
    }
</style>
