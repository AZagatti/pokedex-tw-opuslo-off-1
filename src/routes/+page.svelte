<script lang="ts">
	import { SearchX } from 'lucide-svelte';
	import { getGeneration, getPokemon, getType } from '$lib/api/client';
	import type { Pokemon } from '$lib/api/schemas';
	import CardSkeleton from '$lib/components/CardSkeleton.svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import { statTotal } from '$lib/utils/pokemon';
	import type { PageData } from './$types';
	import type { IndexEntry } from './+page';

	let { data }: { data: PageData } = $props();

	const PAGE = 30;

	// Filter state
	let search = $state('');
	let gen = $state<number | null>(null);
	let types = $state<string[]>([]);
	let sort = $state<'dex' | 'bst'>('dex');

	// Filter membership sets (fetched lazily)
	let genNames = $state<Set<string> | null>(null);
	let typeNames = $state<Set<string> | null>(null);

	// Detail cache for rendered cards
	let details = $state(new Map<string, Pokemon>());
	let shownCount = $state(PAGE);

	// --- Fetch generation membership when `gen` changes ---
	$effect(() => {
		const g = gen;
		if (g === null) {
			genNames = null;
			return;
		}
		let cancelled = false;
		genNames = null;
		getGeneration(g)
			.then((res) => {
				if (!cancelled) {
					genNames = new Set(res.pokemon_species.map((s) => s.name));
				}
			})
			.catch(() => {
				if (!cancelled) {
					genNames = new Set();
				}
			});
		return () => {
			cancelled = true;
		};
	});

	// --- Fetch type membership when `types` changes (union) ---
	$effect(() => {
		const selected = types;
		if (selected.length === 0) {
			typeNames = null;
			return;
		}
		let cancelled = false;
		typeNames = null;
		Promise.all(selected.map((t) => getType(t)))
			.then((results) => {
				if (cancelled) {
					return;
				}
				const set = new Set<string>();
				for (const r of results) {
					for (const p of r.pokemon) {
						set.add(p.pokemon.name);
					}
				}
				typeNames = set;
			})
			.catch(() => {
				if (!cancelled) {
					typeNames = new Set();
				}
			});
		return () => {
			cancelled = true;
		};
	});

	const filtering = $derived(
		(gen !== null && genNames === null) || (types.length > 0 && typeNames === null)
	);

	const filtered = $derived.by<IndexEntry[]>(() => {
		let list = data.entries;
		if (search) {
			list = list.filter((e) => e.name.includes(search));
		}
		const gn = genNames;
		if (gen !== null && gn) {
			list = list.filter((e) => gn.has(e.name));
		}
		const tn = typeNames;
		if (types.length > 0 && tn) {
			list = list.filter((e) => tn.has(e.name));
		}
		return list;
	});

	// Reset paging when the filter key changes
	let prevKey = '';
	$effect(() => {
		const key = `${search}|${gen}|${types.join(',')}`;
		if (key !== prevKey) {
			prevKey = key;
			shownCount = PAGE;
		}
	});

	const slice = $derived(filtered.slice(0, shownCount));

	// Fetch details for the current slice
	$effect(() => {
		for (const entry of slice) {
			if (!details.has(entry.name)) {
				getPokemon(entry.name)
					.then((p) => {
						details.set(entry.name, p);
						details = new Map(details);
					})
					.catch(() => {
						/* leave as skeleton */
					});
			}
		}
	});

	// Ordered slice — dex order by default, or by base-stat total when loaded
	const ordered = $derived.by<IndexEntry[]>(() => {
		if (sort === 'dex') {
			return slice;
		}
		return [...slice].sort((a, b) => {
			const pa = details.get(a.name);
			const pb = details.get(b.name);
			const ta = pa ? statTotal(pa) : -1;
			const tb = pb ? statTotal(pb) : -1;
			return tb - ta;
		});
	});

	const canLoadMore = $derived(shownCount < filtered.length);

	let sentinel = $state<HTMLElement | null>(null);
	$effect(() => {
		const el = sentinel;
		if (!el) {
			return;
		}
		const io = new IntersectionObserver(
			(obsEntries) => {
				if (obsEntries[0]?.isIntersecting && shownCount < filtered.length) {
					shownCount = Math.min(shownCount + PAGE, filtered.length);
				}
			},
			{ rootMargin: '600px 0px' }
		);
		io.observe(el);
		return () => io.disconnect();
	});

	function clearAll() {
		search = '';
		gen = null;
		types = [];
		sort = 'dex';
	}
</script>

<section class="hero">
	<h1>Explore the <span class="grad">Pokédex</span></h1>
	<p>
		{data.entries.length.toLocaleString()} Pokémon at your fingertips. Search, filter by generation or
		type, and build your favorites.
	</p>
</section>

<Toolbar bind:search bind:gen bind:types bind:sort onClear={clearAll} />

<p class="result-count tabular" aria-live="polite">
	{#if filtering}
		Filtering…
	{:else}
		{filtered.length.toLocaleString()} result{filtered.length === 1 ? '' : 's'}
	{/if}
</p>

{#if !filtering && filtered.length === 0}
	<div class="empty" role="status">
		<SearchX size={48} strokeWidth={1.5} />
		<h2>No Pokémon found</h2>
		<p>Try a different search term or clear your filters.</p>
	</div>
{:else}
	<ul class="grid" role="list">
		{#each ordered as entry (entry.name)}
			<li>
				{#if details.get(entry.name)}
					<PokemonCard pokemon={details.get(entry.name)!} eager={entry.id <= 12} />
				{:else}
					<CardSkeleton />
				{/if}
			</li>
		{/each}
		{#if filtering}
			{#each Array.from({ length: 8 }), i (i)}
				<li><CardSkeleton /></li>
			{/each}
		{/if}
	</ul>

	{#if canLoadMore}
		<div bind:this={sentinel} class="sentinel" aria-hidden="true"></div>
		<div class="grid loading-more">
			{#each Array.from({ length: 4 }), i (i)}
				<CardSkeleton />
			{/each}
		</div>
	{/if}
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
		max-width: 46ch;
	}
	.result-count {
		margin-bottom: 0.85rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-soft);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.loading-more {
		margin-top: 1rem;
	}
	.sentinel {
		height: 1px;
	}
	.empty {
		display: grid;
		place-items: center;
		gap: 0.5rem;
		padding: 4rem 1rem;
		text-align: center;
		color: var(--ink-soft);
	}
	.empty h2 {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--ink);
	}
</style>
