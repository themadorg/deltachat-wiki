<script lang="ts">
    import * as Icons from "@lucide/svelte";

    let {
        name,
        size = 24,
        color = "currentColor",
        strokeWidth = 2,
        class: className = "",
    } = $props();

    // Map common names to Lucide icons
    // This is a bit heavy if we import everything, but for a small site it's fine
    // and it makes MDX-like usage much easier.
    const icons: Record<string, any> = Icons;
    const IconComponent = $derived(icons[name] || icons.HelpCircle);
</script>

{#if IconComponent}
    <IconComponent {size} {color} {strokeWidth} class={className} />
{/if}
