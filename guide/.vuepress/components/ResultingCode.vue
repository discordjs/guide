<template>
	<p>
		If you want to compare your code to the code we've constructed so far, you can review it over on the GitHub repository
		<a :href="githubLink" target="_blank" rel="noopener noreferrer">
			here <OutboundLink />
		</a>.
	</p>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { usePageData } from '@vuepress/client';

const codeSamplesURL = 'https://github.com/discordjs/guide/tree/master/code-samples/';

export default defineComponent({
	name: 'ResultingCode',
	props: {
		path: String,
	},
	setup(props) {
		const githubLink = ref(codeSamplesURL);
		const page = usePageData();

		onMounted(() => {
			githubLink.value += props.path || page?.value.path.slice(1).replace('.html', '');
		});

		return {
			githubLink,
		};
	},
});
</script>
