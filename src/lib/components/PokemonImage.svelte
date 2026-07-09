<script lang="ts">
	interface Props {
		src: string | null | undefined;
		alt: string;
		eager?: boolean;
		size?: number;
	}
	let { src, alt, eager = false, size = 160 }: Props = $props();

	let loaded = $state(false);
	let failed = $state(false);
</script>

<div class="wrap" style="--size: {size}px">
	{#if !loaded && !failed}
		<div class="skeleton ph" aria-hidden="true"></div>
	{/if}
	{#if src && !failed}
		<img
			{src}
			{alt}
			width={size}
			height={size}
			loading={eager ? 'eager' : 'lazy'}
			decoding="async"
			class:show={loaded}
			onload={() => (loaded = true)}
			onerror={() => (failed = true)}
		/>
	{:else if failed}
		<div class="ph fallback" aria-hidden="true">?</div>
	{/if}
</div>

<style>
	.wrap {
		position: relative;
		width: var(--size);
		height: var(--size);
		display: grid;
		place-items: center;
	}
	.ph {
		position: absolute;
		inset: 8%;
		border-radius: 50%;
	}
	.fallback {
		display: grid;
		place-items: center;
		font-size: 2rem;
		font-weight: 700;
		color: var(--ink-soft);
		background: color-mix(in srgb, var(--ink-soft) 10%, transparent);
	}
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0;
		transform: scale(0.96);
		transition:
			opacity 0.35s var(--ease-out-soft),
			transform 0.35s var(--ease-out-soft);
		filter: drop-shadow(0 6px 10px rgb(16 24 40 / 0.18));
	}
	img.show {
		opacity: 1;
		transform: scale(1);
	}
</style>
