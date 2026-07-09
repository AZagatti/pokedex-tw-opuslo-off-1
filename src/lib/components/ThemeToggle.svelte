<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme.svelte';
</script>

<button
	type="button"
	class="toggle"
	onclick={() => theme.toggle()}
	aria-label={theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	title="Toggle theme"
>
	<span class="icon" class:dark={theme.value === 'dark'}>
		{#if theme.value === 'dark'}
			<Moon size={18} />
		{:else}
			<Sun size={18} />
		{/if}
	</span>
</button>

<style>
	.toggle {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink);
		cursor: pointer;
		transition:
			transform 0.18s var(--ease-out-soft),
			background 0.18s ease;
	}
	@media (hover: hover) {
		.toggle:hover {
			transform: rotate(-12deg) scale(1.05);
			background: var(--surface-2);
		}
	}
	.icon {
		display: grid;
		place-items: center;
	}
</style>
