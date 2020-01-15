<template>
	<p>
		If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository
		<a :href="githubLink" target="_blank" rel="noopener noreferrer">
			here <outbound-link />
		</a>.
	</p>
</template>

<script>
export default {
	name: 'ResultingCode',
	props: {
		path: String,
	},
	data() {
		return {
			githubLink: 'https://github.com/discordjs/guide/tree/master/code-samples/',
		};
	},
	mounted() {
		this.githubLink += this.path || this.$page.path.slice(1).replace('.html', '');
	},
};
</script>
