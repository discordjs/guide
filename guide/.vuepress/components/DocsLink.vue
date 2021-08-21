<template>
	<a :href="link" target="_blank" rel="noopener noreferrer">
		<slot><code>{{ linkText }}</code></slot><OutboundLink />
	</a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const baseURL = 'https://discord.js.org/#/docs';
const docsSections = ['main', 'collection', 'rpc'];
const docsPathRegex = /\w+\/(\w+)(?:\?scrollTo=(.+))?/;

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
	type: {
		type: String,
		'default': 'property',
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

	const isStatic = property.startsWith('s-');
	const isEvent = property.startsWith('e-');
	const isMethod = props.type === 'method';

	const separator = isStatic ? '.' : '#';
	const name = isStatic
		? property.replace('s-', '')
		: isEvent
			? property.replace('e-', 'event:')
			: property;

	return `${file}${separator}${name}${isMethod ? '()' : ''}`;
});
</script>
