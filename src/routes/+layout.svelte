<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import { theme } from '$lib/stores/theme.svelte';

	let { children } = $props();

	onMount(() => {
		theme.apply();
	});
</script>

<svelte:head>
	<title>Pokédex — a polished PokéAPI explorer</title>
	<meta
		name="description"
		content="A fast, animated Pokédex built with SvelteKit — browse, search and favorite Pokémon and berries from the PokéAPI."
	/>
</svelte:head>

<div class="app">
	<Header />
	<main class="main">
		{@render children()}
	</main>
	<footer class="footer">
		<p>
			Data from <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a>. Built with
			SvelteKit + Svelte 5.
		</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
	}
	.main {
		flex: 1;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1.1rem 3rem;
	}
	.footer {
		border-top: 1px solid var(--line);
		padding: 1.5rem 1.1rem;
		text-align: center;
		color: var(--ink-soft);
		font-size: 0.85rem;
	}
	.footer a {
		color: var(--color-brand);
	}
</style>
