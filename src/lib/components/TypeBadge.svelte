<script lang="ts">
	import { formatName, typeColor } from '$lib/utils/pokemon';

	let { type, size = 'md' }: { type: string; size?: 'sm' | 'md' } = $props();

	const color = $derived(typeColor(type));
</script>

<span
	class="badge"
	class:sm={size === 'sm'}
	style="--type-color: {color}"
	data-type={type}
>
	{formatName(type)}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.02em;
		color: #fff;
		text-shadow: 0 1px 1px rgb(0 0 0 / 0.18);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--type-color) 92%, white),
			var(--type-color)
		);
		box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.25);
	}
	.badge.sm {
		padding: 0.15rem 0.45rem;
		font-size: 0.65rem;
	}
</style>
