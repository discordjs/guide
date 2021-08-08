<template>
	<a :href="link" target="_blank" rel="noopener noreferrer">
		<slot><code>{{ linkText }}</code></slot><OutboundLink />
	</a>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const baseURL = 'https://discord.js.org/#/docs';
const docsSections = ['main', 'collection', 'rpc'];
const docsPathRegex = /\w+\/(\w+)(?:\?scrollTo=(\w+))?/;

const props = defineProps({
	section: {
		type: String,
		'default': 'main',
	},
	branch: String,
	path: {
		type: String,
		required: true,
	},
});

const link = computed(() => {
	const guideSection = docsSections.find(section => section === props.section) || docsSections[0];
	const branch = guideSection === 'main' ? 'stable' : props.branch || 'main';
	return `${baseURL}/${guideSection}/${branch}/${props.path}`;
});

const linkText = computed(() => {
	const [, file, property] = props.path.match(docsPathRegex);
	if (!property) return file;
	return `${file}#${property}`;
});
</script>
