<template>
	<div class="branch-selector-wrapper">
		<label for="branch-selector" class="branch-selector-label">Discord.js Version:</label>
		<select id="branch-selector" v-model="selectedBranch" @change="updateBranch">
			<option v-for="branch in branches" :key="branch.version" :value="branch.version">
				{{ branch.label }}
			</option>
		</select>
	</div>
</template>

<script>
import branches from '../branches.js';
import eventBus from '../eventBus.js';

const [defaultBranch] = branches;

// `route.query` with `page.html?v=1#header` renders as `{ v: '1' }`
// `route.query` with `page.html#header?v=1` renders as `{}`, and renders `route.hash` as `'#header?v=1'`
// the former is plausible but the latter is more common
function extractBranchVersion(query, hash) {
	const versionRegex = /\?(?:v|version)=(.*)/;
	const getBranch = version => branches.find(branch => branch.aliases.includes(version) || branch.version === version);

	if (query.v || query.version) return getBranch(query.v || query.version);
	if (hash.length && versionRegex.test(hash)) return getBranch(hash.match(versionRegex)[1]);
	return null;
}

export default {
	name: 'BranchSelector',
	data() {
		return {
			branches,
			selectedBranch: defaultBranch.version,
		};
	},
	mounted() {
		const branch = extractBranchVersion(this.$route.query, this.$route.hash);

		if (branch) {
			this.selectedBranch = branch.version;
			return this.updateBranch();
		}

		this.selectedBranch = localStorage.getItem('branch-version') || defaultBranch.version;
	},
	methods: {
		updateBranch() {
			localStorage.setItem('branch-version', this.selectedBranch);
			eventBus.$emit('branch-update', this.selectedBranch);
		},
	},
};
</script>

<style lang="stylus">
.user-options-before {
	display: flex;
}

.branch-selector-wrapper {
	display: flex;
	margin-right: 1em;
	min-width: 240px;

	.branch-selector-label {
		margin-right: 0.5em;
	}

	#branch-selector {
		display: block;
		width: 100%;
		border-color: #eaecef;
		padding: 5px;
		box-sizing: border-box;
		border-radius: 4px;
	}

	@media screen and (max-width: 470px) {
		min-width: unset;

		.branch-selector-label {
			display: none;
		}
	}
}

.yuu-theme-dark #branch-selector {
	color: #f3f3f3;
	background-color: #1a1a1a;
	border-color: rgba(255, 255, 255, 0.1);
}
</style>
