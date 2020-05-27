<template>
	<div v-if="showNotice" class="eol-notice">
		Discord has announced breaking API changes that will not be implemented into discord.js version 11.
		<br />
		We expect this to happen around October 2020.
		<br />
		Along with this we decided to no longer maintain bug fixes or new features for version 11 of discord.js. Please
		<router-link to="/additional-info/changes-in-v12.html">
			update your bot to version 12
		</router-link>
		at your earliest convenience. <a href="#" @click.prevent="dismiss">[Dismiss for 1 week]</a>
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
		showNotice() {
			return semver.satisfies(semver.coerce('11.x'), this.selectedBranch) && (!this.hideUntil || Date.now() > parseInt(this.hideUntil));
		},
	},
	mounted() {
		eventBus.$on('branch-update', this.updateBranch);
		this.hideUntil = localStorage.getItem('eol-notice-expiration');
	},
	destroyed() {
		eventBus.$off('branch-update', this.updateBranch);
	},
	methods: {
		dismiss() {
			const expirationTimestamp = Date.now() + (7 * 60 * 60 * 24 * 1000);
			this.hideUntil = expirationTimestamp;
			localStorage.setItem('eol-notice-expiration', expirationTimestamp);
		},
	},
};
</script>

<style lang="stylus">
.eol-notice {
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

.yuu-theme-dark .eol-notice {
	background-color: #1a1a1a;
}

.yuu-theme-blue .eol-notice {
	border-color: #2196f3;
}

.yuu-theme-red .eol-notice {
	border-color: #de3636;
}

.yuu-theme-purple .eol-notice {
	border-color: #a846eb;
}
</style>
