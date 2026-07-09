<script lang="ts">
	import { base } from '$app/paths';
	import { fly } from 'svelte/transition';
	import { ArrowLeft, Clock, Sprout, Maximize, Layers } from 'lucide-svelte';
	import PokemonImage from '$lib/components/PokemonImage.svelte';
	import { formatName } from '$lib/utils/pokemon';
	import { berrySprite, flavorColor } from '$lib/utils/berry';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const b = $derived(data.berry);
	const activeFlavors = $derived(b.flavors.filter((f) => f.potency > 0));

	const facts = $derived([
		{ icon: Clock, label: 'Growth time', value: `${b.growth_time} h/stage` },
		{ icon: Sprout, label: 'Max harvest', value: `${b.max_harvest} berries` },
		{ icon: Maximize, label: 'Size', value: `${b.size} mm` },
		{ icon: Layers, label: 'Firmness', value: formatName(b.firmness.name) }
	]);
</script>

<svelte:head>
	<title>{formatName(b.name)} Berry — Pokédex</title>
	<meta name="description" content={`${formatName(b.name)} berry — firmness ${formatName(b.firmness.name)}, size ${b.size}mm.`} />
</svelte:head>

<a class="back" href={`${base}/berries`}>
	<ArrowLeft size={18} /> Back to Berries
</a>

{#key b.id}
	<article class="detail">
		<header class="hero" in:fly={{ y: 16, duration: 300 }}>
			<div class="art">
				<PokemonImage src={berrySprite(b.name)} alt={formatName(b.name)} size={110} eager />
			</div>
			<div>
				<p class="kicker">Berry #{b.id}</p>
				<h1>{formatName(b.name)}</h1>
				<span class="firmness">{formatName(b.firmness.name)} firmness</span>
			</div>
		</header>

		<div class="facts">
			{#each facts as fact (fact.label)}
				{@const Icon = fact.icon}
				<div class="fact">
					<Icon size={20} />
					<div>
						<span class="fact-val">{fact.value}</span>
						<span class="fact-label">{fact.label}</span>
					</div>
				</div>
			{/each}
		</div>

		<section class="panel">
			<h2>Flavors</h2>
			{#if activeFlavors.length === 0}
				<p class="muted">This berry has no notable flavor.</p>
			{:else}
				<div class="flavors">
					{#each activeFlavors as f (f.flavor.name)}
						<div class="flavor">
							<div class="flavor-head">
								<span>{formatName(f.flavor.name)}</span>
								<span class="tabular">{f.potency}</span>
							</div>
							<div class="track">
								<div
									class="fill"
									style="--w: {Math.min(100, (f.potency / 40) * 100)}%; --c: {flavorColor(f.flavor.name)}"
								></div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>
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
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1.75rem;
		border-radius: var(--radius-card);
		border: 1px solid var(--line);
		background:
			radial-gradient(100% 90% at 15% -10%, color-mix(in srgb, #ec407a 22%, transparent), transparent 65%),
			var(--surface);
		box-shadow: var(--shadow-card);
	}
	.art {
		display: grid;
		place-items: center;
		width: 130px;
		height: 130px;
		flex-shrink: 0;
		border-radius: 50%;
		background: radial-gradient(circle, color-mix(in srgb, #ec407a 18%, transparent), transparent 70%);
	}
	.kicker {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--ink-soft);
	}
	.hero h1 {
		font-size: clamp(1.7rem, 4vw, 2.3rem);
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.firmness {
		color: var(--ink-soft);
		font-weight: 600;
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.85rem;
	}
	.fact {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 1rem;
		border-radius: 1rem;
		border: 1px solid var(--line);
		background: var(--surface);
		box-shadow: var(--shadow-card);
		color: var(--ink-soft);
	}
	.fact div {
		display: flex;
		flex-direction: column;
	}
	.fact-val {
		font-weight: 700;
		color: var(--ink);
	}
	.fact-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
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
	.flavors {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.flavor-head {
		display: flex;
		justify-content: space-between;
		font-weight: 600;
		font-size: 0.9rem;
		margin-bottom: 0.35rem;
	}
	.track {
		height: 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink-soft) 15%, transparent);
		overflow: hidden;
	}
	.fill {
		height: 100%;
		width: 0;
		border-radius: 999px;
		background: linear-gradient(90deg, color-mix(in srgb, var(--c) 70%, white), var(--c));
		animation: grow 0.8s var(--ease-out-soft) forwards;
	}
	@keyframes grow {
		to {
			width: var(--w);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fill {
			width: var(--w);
			animation: none;
		}
	}
	.muted {
		color: var(--ink-soft);
	}
</style>
