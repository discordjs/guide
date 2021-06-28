<template>
	<a :href="link" target="djs-docs" rel="noopener noreferrer">
		<slot></slot><outbound-link />
	</a>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

const baseURL = 'https://discord.js.org/#/docs';
const docsSections = ['main', 'commando', 'collection', 'rpc'];

export default defineComponent({
	name: 'DocsLink',
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
	setup(props) {
		const link = computed(() => {
			const guideSection = docsSections.find(section => section === props.section) || docsSections[0];
			const branch = guideSection === 'main' ? 'stable' : props.branch || 'master';
			return `${baseURL}/${guideSection}/${branch}/${props.path}`;
		});

		return {
			link,
		};
	},
});
</script>
