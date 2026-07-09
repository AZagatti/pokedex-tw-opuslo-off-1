<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { Heart, Cherry, LayoutGrid } from 'lucide-svelte';
	import { favorites } from '$lib/stores/favorites.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: `${base}/`, label: 'Pokédex', icon: LayoutGrid, match: (p: string) => p === `${base}/` || p === base },
		{ href: `${base}/berries`, label: 'Berries', icon: Cherry, match: (p: string) => p.startsWith(`${base}/berries`) },
		{ href: `${base}/favorites`, label: 'Favorites', icon: Heart, match: (p: string) => p.startsWith(`${base}/favorites`) }
	];

	const current = $derived(page.url.pathname);
</script>

<header class="header">
	<div class="inner">
		<a class="brand" href={`${base}/`} aria-label="Pokédex home">
			<span class="ball" aria-hidden="true"></span>
			<span class="brand-text">Poké<strong>dex</strong></span>
		</a>

		<nav class="nav" aria-label="Primary">
			{#each links as link (link.href)}
				{@const Icon = link.icon}
				<a
					href={link.href}
					class="nav-link"
					class:active={link.match(current)}
					aria-current={link.match(current) ? 'page' : undefined}
				>
					<Icon size={16} />
					<span>{link.label}</span>
					{#if link.label === 'Favorites' && favorites.count > 0}
						<span class="count tabular">{favorites.count}</span>
					{/if}
				</a>
			{/each}
		</nav>

		<ThemeToggle />
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--surface) 82%, transparent);
		backdrop-filter: blur(12px) saturate(1.4);
		border-bottom: 1px solid var(--line);
	}
	.inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.7rem 1.1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		text-decoration: none;
		color: inherit;
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}
	.brand-text strong {
		color: var(--color-brand);
	}
	.ball {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background:
			linear-gradient(#fff 0 0) center / 22px 2px no-repeat,
			radial-gradient(circle at 50% 50%, #fff 0 3px, var(--ink) 3px 4.5px, transparent 4.5px),
			linear-gradient(180deg, var(--color-brand) 0 50%, #fff 50% 100%);
		border: 2px solid var(--ink);
		box-shadow: 0 2px 6px rgb(198 40 40 / 0.4);
	}
	.nav {
		display: flex;
		gap: 0.25rem;
		margin-left: auto;
		background: var(--surface-2);
		padding: 0.25rem;
		border-radius: 999px;
		border: 1px solid var(--line);
	}
	.nav-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		text-decoration: none;
		color: var(--ink-soft);
		font-size: 0.85rem;
		font-weight: 600;
		transition:
			color 0.18s ease,
			background 0.18s ease;
	}
	.nav-link span:first-of-type {
		display: none;
	}
	@media (min-width: 560px) {
		.nav-link span:first-of-type {
			display: inline;
		}
	}
	.nav-link.active {
		color: var(--ink);
		background: var(--surface);
		box-shadow: var(--shadow-card);
	}
	@media (hover: hover) {
		.nav-link:hover {
			color: var(--ink);
		}
	}
	.count {
		display: inline-grid;
		place-items: center;
		min-width: 18px;
		height: 18px;
		padding: 0 5px;
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		font-size: 0.68rem;
		font-weight: 700;
	}
</style>
