<script lang="ts">
	import { base } from '$app/paths';
	import { Search } from 'lucide-svelte';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import { formatName } from '$lib/utils/pokemon';
	import { berrySprite } from '$lib/utils/berry';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let query = $state('');
	const filtered = $derived(
		query ? data.berries.filter((b) => b.name.includes(query.toLowerCase())) : data.berries
	);
</script>

<svelte:head>
	<title>Berries — Pokédex</title>
	<meta name="description" content="Browse every berry from the PokéAPI — firmness, flavors, growth time and size." />
</svelte:head>

<section class="hero">
	<h1>Berry <span class="grad">Index</span></h1>
	<p>{data.berries.length} berries — tap any to see its firmness, flavors and growth stats.</p>
</section>

<div class="search">
	<Search size={18} class="ic" />
	<input
		type="search"
		placeholder="Search berries…"
		bind:value={query}
		aria-label="Search berries"
		autocomplete="off"
	/>
</div>

{#if filtered.length === 0}
	<p class="empty" role="status">No berries match “{query}”.</p>
{:else}
	<ul class="grid" role="list">
		{#each filtered as berry, i (berry.name)}
			<li>
				<a class="card" href={`${base}/berries/${berry.name}`}>
					<div class="art">
						<PokemonImage src={berrySprite(berry.name)} alt={formatName(berry.name)} size={56} eager={i < 12} />
					</div>
					<span class="name">{formatName(berry.name)}</span>
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.hero {
		margin-bottom: 1.25rem;
	}
	.hero h1 {
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 800;
		letter-spacing: -0.03em;
	}
	.grad {
		background: linear-gradient(120deg, #ec407a, #ffca28);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.hero p {
		margin-top: 0.4rem;
		color: var(--ink-soft);
	}
	.search {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 1.25rem;
		max-width: 360px;
	}
	.search :global(.ic) {
		position: absolute;
		left: 0.8rem;
		color: var(--ink-soft);
	}
	.search input {
		width: 100%;
		height: 44px;
		padding: 0 1rem 0 2.4rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink);
		font-size: 16px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 0.85rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem 0.75rem;
		border-radius: 1rem;
		border: 1px solid var(--line);
		background: var(--surface);
		box-shadow: var(--shadow-card);
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.2s var(--ease-out-soft),
			box-shadow 0.2s var(--ease-out-soft);
	}
	@media (hover: hover) {
		.card:hover {
			transform: translateY(-4px);
			box-shadow: var(--shadow-lift);
		}
	}
	.art {
		display: grid;
		place-items: center;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: radial-gradient(circle, color-mix(in srgb, #ec407a 16%, transparent), transparent 70%);
	}
	.name {
		font-size: 0.85rem;
		font-weight: 600;
		text-align: center;
	}
	.empty {
		padding: 3rem;
		text-align: center;
		color: var(--ink-soft);
	}
</style>
