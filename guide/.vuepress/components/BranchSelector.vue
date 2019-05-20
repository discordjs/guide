<template>
	<div>
		<label for="branch-selector">Discord.js Version:</label>
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

export default {
	name: 'BranchSelector',

	data() {
		return {
			branches,
			selectedBranch: localStorage.getItem('branch-version') || defaultBranch.version,
		};
	},

	methods: {
		updateBranch() {
			localStorage.setItem('branch-version', this.selectedBranch);
			eventBus.$emit('branch-update', this.selectedBranch);
		},
	},
};
</script>

<style>
#branch-selector {
	display: block;
	width: 100%;
	border-color: #eaecef;
	padding: 5px;
	box-sizing: border-box;
	border-radius: 4px;
}

.yuu-theme-dark #branch-selector {
	color: #f3f3f3;
	background-color: #1a1a1a;
	border-color: rgba(255, 255, 255, 0.1);
}
</style>
