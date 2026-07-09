<script lang="ts">
	import { base } from '$app/paths';
	import { fly, fade } from 'svelte/transition';
	import { ArrowLeft, Volume2, Ruler, Weight } from 'lucide-svelte';
	import EvolutionChain from '$lib/components/EvolutionChain.svelte';
	import HeartButton from '$lib/components/HeartButton.svelte';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import StatBar from '$lib/components/StatBar.svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import { getEvolutionChainByUrl, getSpecies } from '$lib/api/client';
	import type { EvolutionChain as EvoChain } from '$lib/api/schemas';
	import {
		STAT_LABELS,
		dexNumber,
		formatName,
		idFromUrl,
		officialArtwork,
		statTotal,
		typeColor
	} from '$lib/utils/pokemon';
	import type { PageData } from './$types';
	import type { EvoNode } from './+page';

	let { data }: { data: PageData } = $props();

	const p = $derived(data.pokemon);

	// Enrichments (flavor text, genus, evolution chain) load client-side so the
	// page paints immediately from the core Pokémon data.
	let flavor = $state<string | undefined>();
	let genus = $state<string | undefined>();
	let evolution = $state<EvoNode[][]>([]);

	function flattenChain(chain: EvoChain): EvoNode[][] {
		const stages: EvoNode[][] = [];
		let level = [chain.chain];
		while (level.length > 0) {
			stages.push(
				level.map((l) => ({ name: l.species.name, id: idFromUrl(l.species.url) }))
			);
			level = level.flatMap((l) => l.evolves_to);
		}
		return stages;
	}

	$effect(() => {
		const { id } = p;
		let cancelled = false;
		flavor = undefined;
		genus = undefined;
		evolution = [];
		(async () => {
			try {
				const species = await getSpecies(id);
				if (cancelled) {
					return;
				}
				flavor = species.flavor_text_entries
					.find((f) => f.language.name === 'en')
					?.flavor_text.replaceAll(/[\n\f]/gu, ' ');
				genus = species.genera.find((g) => g.language.name === 'en')?.genus;
				if (species.evolution_chain) {
					const chain = await getEvolutionChainByUrl(species.evolution_chain.url);
					if (!cancelled) {
						evolution = flattenChain(chain);
					}
				}
			} catch {
				/* enrichments are optional */
			}
		})();
		return () => {
			cancelled = true;
		};
	});
	const primary = $derived(p.types[0]?.type.name ?? 'normal');
	const accent = $derived(typeColor(primary));

	type Variant = 'front_default' | 'back_default' | 'front_shiny' | 'back_shiny';
	const variantLabels: Record<Variant, string> = {
		front_default: 'Front',
		back_default: 'Back',
		front_shiny: 'Shiny',
		back_shiny: 'Shiny back'
	};
	let variant = $state<Variant>('front_default');
	const availableVariants = $derived(
		(Object.keys(variantLabels) as Variant[]).filter((v) => p.sprites[v])
	);

	const displayArt = $derived(
		variant === 'front_default' ? (officialArtwork(p) ?? p.sprites.front_default) : p.sprites[variant]
	);

	const cryUrl = $derived(p.cries?.latest ?? p.cries?.legacy ?? null);
	let audio: HTMLAudioElement | null = null;
	let playing = $state(false);

	function playCry() {
		if (!cryUrl) {
			return;
		}
		if (!audio) {
			audio = new Audio(cryUrl);
			audio.volume = 0.4;
			audio.addEventListener('ended', () => (playing = false));
		}
		audio.currentTime = 0;
		playing = true;
		void audio.play().catch(() => (playing = false));
	}

	const exampleMoves = $derived(p.moves.slice(0, 8));

	// Reset transient UI when navigating between Pokémon (tracks p.id)
	$effect(() => {
		void p.id;
		variant = 'front_default';
		playing = false;
		audio = null;
	});
</script>

<svelte:head>
	<title>{formatName(p.name)} — Pokédex</title>
	<meta name="description" content={flavor ?? `Details for ${formatName(p.name)}.`} />
</svelte:head>

<a class="back" href={`${base}/`}>
	<ArrowLeft size={18} /> Back to Pokédex
</a>

{#key p.id}
	<article class="detail" style="--accent: {accent}">
		<div class="hero" in:fade={{ duration: 250 }}>
			<div class="art-col">
				<span class="watermark tabular" aria-hidden="true">{dexNumber(p.id)}</span>
				<div class="art" in:fly={{ y: 20, duration: 400 }}>
					<div class="glow" aria-hidden="true"></div>
					<PokemonImage src={displayArt} alt={formatName(p.name)} size={260} eager />
				</div>
				{#if availableVariants.length > 1}
					<div class="variants" role="group" aria-label="Sprite variants">
						{#each availableVariants as v (v)}
							<button
								type="button"
								class="variant"
								class:active={variant === v}
								onclick={() => (variant = v)}
								aria-pressed={variant === v}
							>
								{variantLabels[v]}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<div class="info">
				<div class="title-row">
					<div>
						<p class="dex tabular">{dexNumber(p.id)}</p>
						<h1>{formatName(p.name)}</h1>
						{#if genus}<p class="genus">{genus}</p>{/if}
					</div>
					<HeartButton id={p.id} name={p.name} />
				</div>

				<div class="badges">
					{#each p.types as t (t.type.name)}
						<TypeBadge type={t.type.name} />
					{/each}
				</div>

				{#if flavor}
					<p class="flavor">{flavor}</p>
				{/if}

				<div class="meta">
					<div class="meta-item">
						<Ruler size={18} />
						<div>
							<span class="meta-val tabular">{(p.height / 10).toFixed(1)} m</span>
							<span class="meta-label">Height</span>
						</div>
					</div>
					<div class="meta-item">
						<Weight size={18} />
						<div>
							<span class="meta-val tabular">{(p.weight / 10).toFixed(1)} kg</span>
							<span class="meta-label">Weight</span>
						</div>
					</div>
					{#if cryUrl}
						<button type="button" class="cry" class:playing onclick={playCry} aria-label="Play cry">
							<Volume2 size={18} />
							<span>{playing ? 'Playing…' : 'Play cry'}</span>
						</button>
					{/if}
				</div>
			</div>
		</div>

		<div class="panels">
			<section class="panel">
				<h2>Base stats</h2>
				<div class="stats">
					{#each p.stats as s (s.stat.name)}
						<StatBar
							label={STAT_LABELS[s.stat.name] ?? s.stat.name}
							value={s.base_stat}
							color={accent}
						/>
					{/each}
					<div class="stat-total">
						<span>Total</span>
						<span class="tabular">{statTotal(p)}</span>
					</div>
				</div>
			</section>

			<section class="panel">
				<h2>Abilities</h2>
				<ul class="abilities">
					{#each p.abilities as a (a.ability.name)}
						<li class="ability">
							{formatName(a.ability.name)}
							{#if a.is_hidden}<span class="hidden-tag">Hidden</span>{/if}
						</li>
					{/each}
				</ul>

				<h2 class="mt">Example moves</h2>
				<ul class="moves">
					{#each exampleMoves as m (m.move.name)}
						<li class="move">{formatName(m.move.name)}</li>
					{/each}
				</ul>
			</section>
		</div>

		{#if evolution.length > 1}
			<section class="panel">
				<h2>Evolution</h2>
				<EvolutionChain stages={evolution} current={p.name} />
			</section>
		{/if}
	</article>
{/key}

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 1.25rem;
		color: var(--ink-soft);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
	}
	@media (hover: hover) {
		.back:hover {
			color: var(--ink);
		}
	}
	.detail {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.hero {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		padding: 1.75rem;
		border-radius: var(--radius-card);
		border: 1px solid var(--line);
		background:
			radial-gradient(120% 90% at 20% -10%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 65%),
			var(--surface);
		box-shadow: var(--shadow-card);
	}
	@media (min-width: 720px) {
		.hero {
			grid-template-columns: minmax(260px, 340px) 1fr;
			align-items: center;
		}
	}
	.art-col {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.watermark {
		position: absolute;
		top: -1rem;
		font-size: 5rem;
		font-weight: 800;
		color: color-mix(in srgb, var(--accent) 14%, transparent);
		pointer-events: none;
		z-index: 0;
	}
	.art {
		position: relative;
		display: grid;
		place-items: center;
		z-index: 1;
	}
	.glow {
		position: absolute;
		width: 240px;
		height: 240px;
		border-radius: 50%;
		background: radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent), transparent 65%);
		filter: blur(10px);
		animation: float-bob 6s ease-in-out infinite;
	}
	.variants {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.4rem;
	}
	.variant {
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink-soft);
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s ease;
	}
	.variant.active {
		color: #fff;
		background: var(--accent);
		border-color: var(--accent);
	}
	.info {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}
	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}
	.dex {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--ink-soft);
	}
	.info h1 {
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.05;
	}
	.genus {
		color: var(--ink-soft);
		font-weight: 600;
	}
	.badges {
		display: flex;
		gap: 0.5rem;
	}
	.flavor {
		color: var(--ink-soft);
		line-height: 1.5;
		max-width: 52ch;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}
	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.6rem 0.9rem;
		border-radius: 0.9rem;
		background: var(--surface-2);
		border: 1px solid var(--line);
		color: var(--ink-soft);
	}
	.meta-item div {
		display: flex;
		flex-direction: column;
	}
	.meta-val {
		font-weight: 700;
		color: var(--ink);
		font-size: 0.95rem;
	}
	.meta-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.cry {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		border-radius: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--line));
		background: color-mix(in srgb, var(--accent) 12%, var(--surface));
		color: var(--ink);
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.15s var(--ease-out-soft);
	}
	.cry.playing {
		animation: float-bob 0.6s ease-in-out infinite;
	}
	.cry:active {
		transform: scale(0.96);
	}
	.panels {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}
	@media (min-width: 720px) {
		.panels {
			grid-template-columns: 1fr 1fr;
		}
	}
	.panel {
		padding: 1.5rem;
		border-radius: var(--radius-card);
		border: 1px solid var(--line);
		background: var(--surface);
		box-shadow: var(--shadow-card);
	}
	.panel h2 {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}
	.panel h2.mt {
		margin-top: 1.5rem;
	}
	.stats {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}
	.stat-total {
		display: flex;
		justify-content: space-between;
		padding-top: 0.7rem;
		margin-top: 0.3rem;
		border-top: 1px solid var(--line);
		font-weight: 700;
	}
	.abilities,
	.moves {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.ability {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.8rem;
		border-radius: 0.75rem;
		background: var(--surface-2);
		border: 1px solid var(--line);
		font-weight: 600;
		font-size: 0.88rem;
	}
	.hidden-tag {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 700;
		color: #fff;
		background: var(--accent);
		padding: 0.1rem 0.4rem;
		border-radius: 999px;
	}
	.move {
		padding: 0.4rem 0.7rem;
		border-radius: 0.7rem;
		background: var(--surface-2);
		border: 1px solid var(--line);
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ink-soft);
	}
</style>
