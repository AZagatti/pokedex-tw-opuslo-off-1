<div class="card-skel" aria-hidden="true">
	<div class="skeleton img"></div>
	<div class="skeleton line w60"></div>
	<div class="skeleton line w40"></div>
	<div class="badges">
		<div class="skeleton pill"></div>
		<div class="skeleton pill"></div>
	</div>
</div>

<style>
	.card-skel {
		border-radius: var(--radius-card);
		border: 1px solid var(--line);
		background: var(--surface);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		min-height: 210px;
	}
	.img {
		height: 110px;
		border-radius: 1rem;
	}
	.line {
		height: 12px;
		border-radius: 6px;
	}
	.w60 {
		width: 60%;
	}
	.w40 {
		width: 40%;
	}
	.badges {
		display: flex;
		gap: 0.4rem;
		margin-top: auto;
	}
	.pill {
		height: 20px;
		width: 52px;
		border-radius: 999px;
	}
</style>
