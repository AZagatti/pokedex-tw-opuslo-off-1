<script lang="ts">
	import { base } from '$app/paths';
	import { HeartCrack } from 'lucide-svelte';
	import { getPokemon } from '$lib/api/client';
	import type { Pokemon } from '$lib/api/schemas';
	import CardSkeleton from '$lib/components/CardSkeleton.svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import { favorites } from '$lib/stores/favorites.svelte';

	let details = $state(new Map<number, Pokemon>());

	// Fetch details for every favorited id
	$effect(() => {
		for (const id of favorites.ids) {
			if (!details.has(id)) {
				getPokemon(id)
					.then((p) => {
						details.set(id, p);
						details = new Map(details);
					})
					.catch(() => {
						/* ignore */
					});
			}
		}
	});

	const ordered = $derived([...favorites.ids].sort((a, b) => a - b));
</script>

<svelte:head>
	<title>Favorites — Pokédex</title>
	<meta name="description" content="Your favorited Pokémon, saved locally in your browser." />
</svelte:head>

<section class="hero">
	<h1>Your <span class="grad">Favorites</span></h1>
	<p>
		{favorites.count} Pokémon saved. Tap the heart on any Pokémon to add or remove it — your list
		lives in this browser.
	</p>
</section>

{#if favorites.count === 0}
	<div class="empty" role="status">
		<HeartCrack size={48} strokeWidth={1.5} />
		<h2>No favorites yet</h2>
		<p>Browse the Pokédex and tap the heart to start your collection.</p>
		<a class="cta" href={`${base}/`}>Explore Pokédex</a>
	</div>
{:else}
	<ul class="grid" role="list">
		{#each ordered as id (id)}
			<li>
				{#if details.get(id)}
					<PokemonCard pokemon={details.get(id)!} />
				{:else}
					<CardSkeleton />
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style>
	.hero {
		margin-bottom: 1.5rem;
	}
	.hero h1 {
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 800;
		letter-spacing: -0.03em;
	}
	.grad {
		background: linear-gradient(120deg, var(--color-brand), #ff9d55);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.hero p {
		margin-top: 0.4rem;
		color: var(--ink-soft);
		max-width: 48ch;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.empty {
		display: grid;
		place-items: center;
		gap: 0.6rem;
		padding: 4rem 1rem;
		text-align: center;
		color: var(--ink-soft);
	}
	.empty h2 {
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--ink);
	}
	.cta {
		margin-top: 0.5rem;
		padding: 0.7rem 1.4rem;
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		font-weight: 700;
		text-decoration: none;
		box-shadow: 0 8px 20px -8px var(--color-brand);
	}
</style>
