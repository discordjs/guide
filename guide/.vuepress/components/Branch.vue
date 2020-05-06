<template>
	<span v-show="displayContent" :style="{ display: inline ? 'inline-block' : 'block' }">
		<slot></slot>
	</span>
</template>

<script>
import semver from 'semver';
import eventBus from '../eventBus.js';
import branches from '../mixins/branches.js';

export default {
	name: 'Branch',
	mixins: [branches],
	props: {
		version: {
			type: String,
			required: true,
		},
		inline: {
			type: Boolean,
			'default': false,
		},
	},
	computed: {
		displayContent() {
			return semver.satisfies(semver.coerce(this.version), this.selectedBranch);
		},
	},
	mounted() {
		eventBus.$on('branch-update', this.updateBranch);
	},
	destroyed() {
		eventBus.$off('branch-update', this.updateBranch);
	},
};
</script>
