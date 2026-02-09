<script lang="ts">
    import { Check, X, AlertTriangle, RefreshCw } from "@lucide/svelte";

    interface CellData {
        status: "yes" | "no" | "dev" | "warn";
        text?: string;
    }

    interface TableRow {
        feature: string;
        cols: CellData[];
    }

    let {
        title = "",
        headers = [],
        rows = [],
    } = $props<{
        title?: string;
        headers: string[];
        rows: TableRow[];
    }>();
</script>

<div class="comparison-wrapper">
    {#if title}
        <h2 class="comparison-title">{title}</h2>
    {/if}
    <div class="table-scroll">
        <table>
            <thead>
                <tr>
                    <th class="feature-th">{headers[0] || "Feature"}</th>
                    {#each headers.slice(1) as h}
                        <th>{h}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each rows as row}
                    <tr>
                        <td class="feature-td">{row.feature}</td>
                        {#each row.cols as cell}
                            <td>
                                <span class="cell-content">
                                    {#if cell.status === "yes"}
                                        <span class="icon-yes"
                                            ><Check
                                                size={18}
                                                strokeWidth={2.5}
                                            /></span
                                        >
                                    {:else if cell.status === "no"}
                                        <span class="icon-no"
                                            ><X
                                                size={18}
                                                strokeWidth={2.5}
                                            /></span
                                        >
                                    {:else if cell.status === "warn"}
                                        <span class="icon-warn"
                                            ><AlertTriangle
                                                size={16}
                                                strokeWidth={2}
                                            /></span
                                        >
                                    {:else if cell.status === "dev"}
                                        <span class="icon-dev"
                                            ><RefreshCw
                                                size={16}
                                                strokeWidth={2}
                                            /></span
                                        >
                                    {/if}
                                    {#if cell.text}
                                        <span class="cell-text"
                                            >{cell.text}</span
                                        >
                                    {/if}
                                </span>
                            </td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .comparison-wrapper {
        margin: 2rem 0;
    }

    .comparison-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text);
        margin-bottom: 1rem;
        border: none;
        padding: 0;
    }

    .table-scroll {
        border-radius: 12px;
        overflow: hidden;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        background: var(--bg);
    }

    thead tr {
        background: rgba(var(--primary-rgb), 0.08);
        border-bottom: 1px solid var(--border);
    }

    th {
        padding: 0.85rem 1rem;
        font-weight: 600;
        font-size: 0.85rem;
        color: var(--text-muted);
        text-align: center;
        border: none;
        white-space: nowrap;
        letter-spacing: 0.02em;
    }

    .feature-th {
        text-align: start;
        padding-inline-start: 1.5rem;
    }

    td {
        padding: 0.85rem 1rem;
        text-align: center;
        font-size: 0.9rem;
        border-bottom: 1px solid var(--border);
        color: var(--text);
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    tbody tr:hover {
        background: rgba(var(--primary-rgb), 0.04);
    }

    .feature-td {
        text-align: start;
        padding-inline-start: 1.5rem;
        font-weight: 500;
        color: var(--text);
    }

    .cell-content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
    }

    .cell-text {
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    .icon-yes {
        color: var(--primary);
        display: flex;
    }
    .icon-no {
        color: #ef4444;
        display: flex;
    }
    .icon-warn {
        color: #f59e0b;
        display: flex;
    }
    .icon-dev {
        color: var(--text-muted);
        display: flex;
    }

    @media (max-width: 640px) {
        .table-scroll {
            overflow-x: auto;
        }

        th,
        td {
            padding: 0.7rem 0.5rem;
            font-size: 0.8rem;
            min-width: 80px;
        }

        .feature-th,
        .feature-td {
            min-width: 120px;
            padding-inline-start: 1rem;
        }
    }
</style>
