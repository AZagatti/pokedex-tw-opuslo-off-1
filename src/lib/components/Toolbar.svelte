<script lang="ts">
	import { Search, X, SlidersHorizontal } from 'lucide-svelte';
	import { ALL_TYPES, GENERATIONS, formatName, typeColor } from '$lib/utils/pokemon';

	interface Props {
		search: string;
		gen: number | null;
		types: string[];
		sort: 'dex' | 'bst';
		onClear: () => void;
	}
	let {
		search = $bindable(),
		gen = $bindable(),
		types = $bindable(),
		sort = $bindable(),
		onClear
	}: Props = $props();

	let raw = $state(search);
	let showFilters = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function onInput(e: Event) {
		raw = (e.target as HTMLInputElement).value;
		clearTimeout(timer);
		timer = setTimeout(() => {
			search = raw.trim().toLowerCase();
		}, 250);
	}

	function toggleType(t: string) {
		types = types.includes(t) ? types.filter((x) => x !== t) : [...types, t];
	}

	function selectGen(id: number) {
		gen = gen === id ? null : id;
	}

	const hasFilters = $derived(
		search.length > 0 || gen !== null || types.length > 0 || sort !== 'dex'
	);

	function clearAll() {
		raw = '';
		onClear();
	}
</script>

<div class="toolbar">
	<div class="bar">
		<div class="search">
			<Search size={18} class="search-icon" />
			<input
				type="search"
				placeholder="Search Pokémon by name…"
				value={raw}
				oninput={onInput}
				aria-label="Search Pokémon by name"
				autocomplete="off"
				spellcheck="false"
			/>
			{#if raw}
				<button
					type="button"
					class="clear-input"
					onclick={() => {
						raw = '';
						search = '';
					}}
					aria-label="Clear search"
				>
					<X size={16} />
				</button>
			{/if}
		</div>

		<div class="controls">
			<label class="sort">
				<span class="sr-only">Sort by</span>
				<select bind:value={sort} aria-label="Sort Pokémon">
					<option value="dex">Sort: Dex №</option>
					<option value="bst">Sort: Base stat total</option>
				</select>
			</label>
			<button
				type="button"
				class="filter-toggle"
				class:on={showFilters}
				onclick={() => (showFilters = !showFilters)}
				aria-expanded={showFilters}
				aria-controls="filter-panel"
			>
				<SlidersHorizontal size={16} />
				<span>Filters</span>
				{#if gen !== null || types.length > 0}
					<span class="dot" aria-hidden="true"></span>
				{/if}
			</button>
			{#if hasFilters}
				<button type="button" class="clear-all" onclick={clearAll}>
					<X size={14} /> Clear
				</button>
			{/if}
		</div>
	</div>

	{#if showFilters}
		<div class="panel" id="filter-panel">
			<fieldset>
				<legend>Generation</legend>
				<div class="chips">
					{#each GENERATIONS as g (g.id)}
						<button
							type="button"
							class="chip"
							class:active={gen === g.id}
							onclick={() => selectGen(g.id)}
							title={g.region}
							aria-pressed={gen === g.id}
						>
							{g.label}
						</button>
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend>Type</legend>
				<div class="chips">
					{#each ALL_TYPES as t (t)}
						<button
							type="button"
							class="chip type"
							class:active={types.includes(t)}
							style="--tc: {typeColor(t)}"
							onclick={() => toggleType(t)}
							aria-pressed={types.includes(t)}
						>
							{formatName(t)}
						</button>
					{/each}
				</div>
			</fieldset>
		</div>
	{/if}
</div>

<style>
	.toolbar {
		position: sticky;
		top: 62px;
		z-index: 30;
		margin-bottom: 1.25rem;
		padding: 0.85rem;
		border-radius: 1.1rem;
		border: 1px solid var(--line);
		background: color-mix(in srgb, var(--surface) 88%, transparent);
		backdrop-filter: blur(12px);
		box-shadow: var(--shadow-card);
	}
	.bar {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}
	.search {
		position: relative;
		flex: 1 1 240px;
		display: flex;
		align-items: center;
	}
	.search :global(.search-icon) {
		position: absolute;
		left: 0.8rem;
		color: var(--ink-soft);
		pointer-events: none;
	}
	.search input {
		width: 100%;
		height: 44px;
		padding: 0 2.4rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink);
		font-size: 16px;
	}
	.clear-input {
		position: absolute;
		right: 0.5rem;
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: none;
		background: var(--surface-2);
		color: var(--ink-soft);
		cursor: pointer;
	}
	.controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}
	select {
		height: 44px;
		padding: 0 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}
	.filter-toggle,
	.clear-all {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		height: 44px;
		padding: 0 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		position: relative;
	}
	.filter-toggle.on {
		background: var(--surface-2);
	}
	.clear-all {
		color: var(--color-brand);
		border-color: color-mix(in srgb, var(--color-brand) 30%, var(--line));
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-brand);
	}
	.panel {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		margin-top: 0.85rem;
		padding-top: 0.85rem;
		border-top: 1px solid var(--line);
		animation: fade-in 0.2s var(--ease-out-soft);
	}
	fieldset {
		border: none;
		padding: 0;
		margin: 0;
	}
	legend {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--ink-soft);
		margin-bottom: 0.5rem;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.chip {
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink-soft);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 0.15s var(--ease-out-soft),
			background 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}
	.chip.active {
		color: var(--ink);
		background: var(--surface-2);
		border-color: color-mix(in srgb, var(--color-brand) 40%, var(--line));
	}
	.chip.type.active {
		color: #fff;
		background: var(--tc);
		border-color: var(--tc);
	}
	@media (hover: hover) {
		.chip:hover {
			transform: translateY(-1px);
			color: var(--ink);
		}
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
</style>
