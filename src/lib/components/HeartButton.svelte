<script lang="ts">
	import { Heart } from 'lucide-svelte';
	import { favorites } from '$lib/stores/favorites.svelte';
	import { formatName } from '$lib/utils/pokemon';

	let { id, name }: { id: number; name: string } = $props();

	const active = $derived(favorites.has(id));

	function onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		favorites.toggle(id);
	}
</script>

<button
	type="button"
	class="heart"
	class:active
	onclick={onClick}
	aria-pressed={active}
	aria-label={active
		? `Remove ${formatName(name)} from favorites`
		: `Add ${formatName(name)} to favorites`}
	title={active ? 'Remove from favorites' : 'Add to favorites'}
>
	<Heart size={18} fill={active ? 'currentColor' : 'none'} strokeWidth={2.2} />
</button>

<style>
	.heart {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--surface) 80%, transparent);
		backdrop-filter: blur(6px);
		color: var(--ink-soft);
		cursor: pointer;
		transition:
			transform 0.18s var(--ease-out-soft),
			color 0.18s ease,
			background 0.18s ease;
	}
	.heart.active {
		color: var(--color-brand);
		background: color-mix(in srgb, var(--color-brand) 12%, var(--surface));
		border-color: color-mix(in srgb, var(--color-brand) 30%, var(--line));
	}
	@media (hover: hover) {
		.heart:hover {
			transform: scale(1.1);
			color: var(--color-brand);
		}
	}
	.heart:active {
		transform: scale(0.9);
	}
</style>
