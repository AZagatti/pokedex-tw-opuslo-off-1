<script lang="ts">
	import { base } from '$app/paths';
	import type { Pokemon } from '$lib/api/schemas';
	import { dexNumber, formatName, officialArtwork, typeColor } from '$lib/utils/pokemon';
	import HeartButton from './HeartButton.svelte';
	import PokemonImage from './PokemonImage.svelte';
	import TypeBadge from './TypeBadge.svelte';

	let { pokemon, eager = false }: { pokemon: Pokemon; eager?: boolean } = $props();

	const primary = $derived(pokemon.types[0]?.type.name ?? 'normal');
	const art = $derived(officialArtwork(pokemon));
</script>

<!--
	The card is a container with a single stretched overlay link for navigation,
	so the favorite <button> can live as a sibling (never nested inside an <a>).
-->
<div class="card" style="--accent: {typeColor(primary)}" data-testid="pokemon-card">
	<a
		class="stretch"
		href={`${base}/pokemon/${pokemon.name}`}
		aria-label={formatName(pokemon.name)}
	></a>
	<div class="top">
		<span class="dex tabular">{dexNumber(pokemon.id)}</span>
		<HeartButton id={pokemon.id} name={pokemon.name} />
	</div>
	<div class="art">
		<div class="glow" aria-hidden="true"></div>
		<PokemonImage src={art} alt={formatName(pokemon.name)} size={130} {eager} />
	</div>
	<h2 class="name">{formatName(pokemon.name)}</h2>
	<div class="badges">
		{#each pokemon.types as t (t.type.name)}
			<TypeBadge type={t.type.name} size="sm" />
		{/each}
	</div>
</div>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: var(--radius-card);
		border: 1px solid var(--line);
		background:
			radial-gradient(120% 80% at 50% -20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%),
			var(--surface);
		box-shadow: var(--shadow-card);
		text-decoration: none;
		color: inherit;
		overflow: hidden;
		transition:
			transform 0.22s var(--ease-out-soft),
			box-shadow 0.22s var(--ease-out-soft),
			border-color 0.22s ease;
		will-change: transform;
	}
	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		padding: 1px;
		background: linear-gradient(140deg, color-mix(in srgb, var(--accent) 55%, transparent), transparent 60%);
		-webkit-mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		mask:
			linear-gradient(#000 0 0) content-box,
			linear-gradient(#000 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		opacity: 0;
		transition: opacity 0.22s ease;
	}
	@media (hover: hover) {
		.card:hover {
			transform: translateY(-6px);
			box-shadow: var(--shadow-lift);
			border-color: color-mix(in srgb, var(--accent) 40%, var(--line));
		}
		.card:hover::before {
			opacity: 1;
		}
		.card:hover .glow {
			opacity: 0.9;
			transform: scale(1.05);
		}
	}
	.card:active {
		transform: translateY(-2px) scale(0.99);
	}
	.stretch {
		position: absolute;
		inset: 0;
		z-index: 1;
		border-radius: inherit;
	}
	.stretch:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: -3px;
	}
	.top {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.dex {
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--ink-soft);
	}
	.art {
		position: relative;
		display: grid;
		place-items: center;
		padding: 0.25rem 0;
	}
	.glow {
		position: absolute;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent), transparent 65%);
		filter: blur(6px);
		opacity: 0.5;
		transition:
			opacity 0.22s ease,
			transform 0.22s var(--ease-out-soft);
	}
	.name {
		font-size: 1.02rem;
		font-weight: 700;
		letter-spacing: -0.01em;
	}
	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: auto;
	}
</style>
