<template>
	<div class="notifications-wrapper">
		<div class="notifications">
			<slot></slot>
		</div>
	</div>
</template>

<style lang="scss">
.notifications-wrapper {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 1.25rem;
	z-index: 35;

	.notifications {
		width: 100%;
		max-width: var(--wrapper-max-width);
		margin: 0 auto;
		padding: 0 2rem;
		box-sizing: border-box;

		@media (max-width: 719px) {
			padding: 0.5rem;
		}

		.notification {
			margin-top: 1.25rem;

			&:first-of-type {
				margin-top: 0;
			}
		}
	}
}
</style>
