<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { Ghost } from 'lucide-svelte';
</script>

<svelte:head>
	<title>{page.status} — Pokédex</title>
</svelte:head>

<div class="error">
	<Ghost size={72} strokeWidth={1.5} />
	<p class="status tabular">{page.status}</p>
	<h1>{page.status === 404 ? 'Page not found' : 'Something went wrong'}</h1>
	<p class="msg">{page.error?.message ?? 'An unexpected error occurred.'}</p>
	<a class="cta" href={`${base}/`}>Back to Pokédex</a>
</div>

<style>
	.error {
		display: grid;
		place-items: center;
		gap: 0.5rem;
		padding: 5rem 1rem;
		text-align: center;
		color: var(--ink-soft);
	}
	.status {
		font-size: 3rem;
		font-weight: 800;
		color: var(--color-brand);
		line-height: 1;
	}
	.error h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--ink);
	}
	.msg {
		max-width: 40ch;
	}
	.cta {
		margin-top: 1rem;
		padding: 0.7rem 1.4rem;
		border-radius: 999px;
		background: var(--color-brand);
		color: #fff;
		font-weight: 700;
		text-decoration: none;
	}
</style>
