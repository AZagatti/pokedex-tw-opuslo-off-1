<script lang="ts">
	import { base } from '$app/paths';
	import { ChevronRight } from 'lucide-svelte';
	import PokemonImage from './PokemonImage.svelte';
	import { formatName } from '$lib/utils/pokemon';
	import type { EvoNode } from '../../routes/pokemon/[name]/+page';

	let { stages, current }: { stages: EvoNode[][]; current: string } = $props();

	function sprite(id: number): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
	}
</script>

<nav class="evo" aria-label="Evolution chain">
	{#each stages as stage, i (i)}
		{#if i > 0}
			<div class="arrow" aria-hidden="true"><ChevronRight size={22} /></div>
		{/if}
		<div class="stage">
			{#each stage as node (node.name)}
				<a
					class="node"
					class:current={node.name === current}
					href={`${base}/pokemon/${node.name}`}
					aria-current={node.name === current ? 'page' : undefined}
				>
					<PokemonImage src={sprite(node.id)} alt={formatName(node.name)} size={72} />
					<span class="name">{formatName(node.name)}</span>
				</a>
			{/each}
		</div>
	{/each}
</nav>

<style>
	.evo {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.stage {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.node {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.6rem;
		border-radius: 1rem;
		border: 1px solid var(--line);
		background: var(--surface);
		text-decoration: none;
		color: var(--ink-soft);
		transition:
			transform 0.18s var(--ease-out-soft),
			border-color 0.18s ease,
			color 0.18s ease;
	}
	.node.current {
		color: var(--ink);
		border-color: color-mix(in srgb, var(--color-brand) 45%, var(--line));
		background: var(--surface-2);
	}
	@media (hover: hover) {
		.node:hover {
			transform: translateY(-3px);
			color: var(--ink);
		}
	}
	.name {
		font-size: 0.78rem;
		font-weight: 600;
	}
	.arrow {
		color: var(--ink-soft);
	}
</style>
