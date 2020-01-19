<template>
	<span v-show="displayContent" :style="{ display: inline ? 'inline-block' : 'block' }">
		<slot></slot>
	</span>
</template>

<script>
import semver from 'semver';
import branches from '../branches.js';
import eventBus from '../eventBus.js';

const [defaultBranch] = branches;

export default {
	name: 'Branch',
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
	data() {
		return {
			selectedBranch: defaultBranch.version,
		};
	},
	computed: {
		displayContent() {
			return semver.satisfies(semver.coerce(this.version), this.selectedBranch);
		},
	},
	mounted() {
		this.selectedBranch = localStorage.getItem('branch-version') || defaultBranch.version;
		eventBus.$on('branch-update', this.updateBranch);
	},
	destroyed() {
		eventBus.$off('branch-update', this.updateBranch);
	},
	methods: {
		updateBranch(branch) {
			this.selectedBranch = branch;
		},
	},
};
</script>
