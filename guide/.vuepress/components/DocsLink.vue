<template>
	<a :href="link" target="_blank" rel="noopener noreferrer">
		<slot><code>{{ linkText ?? '' }}</code></slot><OutboundLink />
	</a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const baseURL = 'https://discord.js.org/docs/packages';
const sections = ['discord.js', 'brokers', 'builders', 'collection', 'core', 'formatters', 'proxy', 'rest', 'util', 'voice', 'ws'];
const pathRegex = /(\w+):(\w+)(?:#(.+))?/i;

const props = defineProps({
	section: {
		type: String,
		'default': 'discord.js',
	},
	branch: {
		type: String,
		'default': 'stable',
	},
	path: {
		type: String,
	},
	type: {
		type: String,
		'default': 'property',
	},
});

const link = computed(() => {
	const guideSection = sections.find(section => section === props.section) || sections[0];
	return `${baseURL}/${guideSection}/${props.branch}${props.path ? `/${props.path}` : ''}`;
});

const linkText = computed(() => {
	if (props.path) {
		const regex = pathRegex.exec(props.path);

		if (regex) {
			const [, file, type, symbol] = regex;
			const brackets = type === 'Function' || props.type === 'method' ? '()' : '';
			if (!symbol) return `${file}${brackets}`;
			return `${file}#${symbol}${brackets}`;
		}
	} else {
		return `${props.section === 'discord.js' ? '' : '@discordjs/'}${props.section}`;
	}

	return null;
});
</script>
