<template>
	<div v-if="showNotification" class="version-notification">
		<span v-if="v11">
			We no longer provide support, maintain bug fixes or new features for discord.js v11.
			<br />
			Please <a href="https://discordjs.guide/whats-new.html">update to discord.js v13</a> at your earliest convenience.
			<br />
			We expect v11 to die for good around the start of 2021 due to Discord introducing breaking changes.
		</span>
		<span v-else>
			You're browsing the guide for discord.js v12.
			Check out <a href="https://discordjs.guide/whats-new.html">what's new in discord.js v14</a>.
		</span>
		<br />
		<a href="#" @click.prevent="dismiss">[Dismiss for 1 week]</a>
	</div>
</template>

<script>
import semver from 'semver';
import eventBus from '../eventBus.js';
import branches from '../mixins/branches.js';

export default {
	mixins: [branches],
	data() {
		return {
			hideUntil: null,
		};
	},
	computed: {
		showNotification() {
			return !this.hideUntil || Date.now() > parseInt(this.hideUntil);
		},
		v11() {
			return semver.satisfies(semver.coerce('11.x'), this.selectedBranch);
		},
	},
	mounted() {
		eventBus.$on('branch-update', this.updateBranch);
		this.hideUntil = localStorage.getItem('version-notification-expiration');
	},
	destroyed() {
		eventBus.$off('branch-update', this.updateBranch);
	},
	methods: {
		dismiss() {
			const expirationTimestamp = Date.now() + (7 * 60 * 60 * 24 * 1000);
			this.hideUntil = expirationTimestamp;
			localStorage.setItem('version-notification-expiration', expirationTimestamp);
		},
	},
};
</script>

<style lang="stylus">
.version-notification {
	background-color: #fff;
	position: fixed;
	right: 1rem;
	bottom: 1rem;
	left: 21rem;
	padding: 1em;
	border: 1px solid #3eaf7c;
	border-radius: 4px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
	text-align: center;
	z-index: 100;

	@media (max-width: 959px) {
		left: 17.4rem;
	}

	@media (max-width: 719px) {
		left: 1rem;
	}
}

.yuu-theme-dark .version-notification {
	background-color: #1a1a1a;
}

.yuu-theme-blue .version-notification {
	border-color: #2196f3;
}

.yuu-theme-red .version-notification {
	border-color: #de3636;
}

.yuu-theme-purple .version-notification {
	border-color: #a846eb;
}
</style>
