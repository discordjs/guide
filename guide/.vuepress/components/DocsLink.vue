<template>
	<a :href="link" target="_blank" rel="noopener noreferrer">
		<slot></slot><OutboundLink />
	</a>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const baseURL = 'https://discord.js.org/#/docs';
const docsSections = ['main', 'commando', 'collection', 'rpc'];

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
	const branch = guideSection === 'main' ? 'stable' : props.branch || 'master';
	return `${baseURL}/${guideSection}/${branch}/${props.path}`;
});
</script>
