<template>
	<div class="notifications-wrapper">
		<div class="notifications">
			<Notification storage-key="v13-notice">
				<span class="notification-icon"><PartyPopper /></span>
				<span>
					You're browsing the guide for discord.js v13, which is still a work in progress.
					<a href="https://discordjs.guide">Click here</a> for the discord.js v12 guide.
				</span>
			</Notification>
		</div>
	</div>
</template>

<script setup lang="ts">
import Notification from './Notification.vue';
import PartyPopper from './icons/PartyPopper.vue';
</script>

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
