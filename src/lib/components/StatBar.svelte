<script lang="ts">
	import { MAX_STAT } from '$lib/utils/pokemon';

	interface Props {
		label: string;
		value: number;
		color: string;
		animate?: boolean;
	}
	let { label, value, color, animate = true }: Props = $props();

	const pct = $derived(Math.min(100, Math.round((value / MAX_STAT) * 100)));
</script>

<div class="row">
	<span class="label">{label}</span>
	<span class="value tabular">{value}</span>
	<div class="track" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={MAX_STAT} aria-label={label}>
		<div
			class="fill"
			class:animate
			style="--target: {pct}%; --bar: {color}"
		></div>
	</div>
</div>

<style>
	.row {
		display: grid;
		grid-template-columns: 4.5rem 2.25rem 1fr;
		align-items: center;
		gap: 0.75rem;
	}
	.label {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-soft);
	}
	.value {
		font-size: 0.82rem;
		font-weight: 700;
		text-align: right;
	}
	.track {
		height: 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink-soft) 15%, transparent);
		overflow: hidden;
	}
	.fill {
		height: 100%;
		width: var(--target);
		border-radius: 999px;
		background: linear-gradient(90deg, color-mix(in srgb, var(--bar) 70%, white), var(--bar));
	}
	.fill.animate {
		width: 0;
		animation: grow 0.9s var(--ease-out-soft) forwards;
	}
	@keyframes grow {
		to {
			width: var(--target);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fill.animate {
			width: var(--target);
			animation: none;
		}
	}
</style>
