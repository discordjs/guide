<template>
	<a :href="link" target="_blank" rel="noopener noreferrer">
		<slot></slot><outbound-link />
	</a>
</template>

<script>
import eventBus from '../eventBus.js';
import branches from '../mixins/branches.js';

const baseURL = 'https://discord.js.org/#/docs';
const docsSections = ['main', 'commando', 'collection', 'rpc'];

export default {
	name: 'DocsLink',
	mixins: [branches],
	props: {
		section: {
			type: String,
			'default': 'main',
		},
		branch: String,
		path: {
			type: String,
			required: true,
		},
	},
	computed: {
		link() {
			const guideSection = docsSections.find(section => section === this.section) || docsSections[0];

			const branch = guideSection === 'main'
				? this.getBranch(this.branch)
					? this.formatBranch(this.getBranch(this.branch).version)
					: this.branch || this.formatBranch(this.selectedBranch)
				: this.branch || 'master';

			return `${baseURL}/${guideSection}/${branch}/${this.path}`;
		},
	},
	mounted() {
		eventBus.$on('branch-update', this.updateBranch);
	},
	destroyed() {
		eventBus.$off('branch-update', this.updateBranch);
	},
	methods: {
		formatBranch(version) {
			// NOTE: v12 is the current stable branch,
			// but linking to the `v12` branch points to an outdated version
			// This is temporary until v13 comes stable
			if (version.startsWith('12')) return 'stable';
			return `v${version.slice(0, 2)}`;
		},
	},
};
</script>
