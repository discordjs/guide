<template>
	<a :href="link" target="_blank" rel="noopener noreferrer">
		<slot><code>{{ linkText ?? '' }}</code></slot><OutboundLink />
	</a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defaultDjsBranch } from '../constants';

const legacyBaseURL = 'https://old.discordjs.dev/#/docs';
const baseURL = 'https://discord.js.org/docs/packages';
const sections = ['discord.js', 'brokers', 'builders', 'collection', 'core', 'formatters', 'proxy', 'rest', 'util', 'voice', 'ws'];
const legacyPathRegex = /\w+\/(\w+)(?:\?scrollTo=(.+))?/;
const pathRegex = /(\w+):(\w+)(?:#(.+))?/i;

const props = defineProps({
	section: {
		type: String,
		'default': 'discord.js',
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
	const guideSection = sections.find(section => section === props.section) || sections[0];
	const branch = props.branch || (props.section === sections[0] ? defaultDjsBranch : 'stable');
	const url = guideSection === sections[0] ? legacyBaseURL : baseURL;
	return `${url}/${guideSection}/${branch}/${props.path}`;
});

const linkText = computed(() => {
	const legacyRegex = legacyPathRegex.exec(props.path);
	const regex = pathRegex.exec(props.path);

	if (legacyRegex) {
		const [, file, symbol] = legacyRegex;
		if (!symbol) return file;

		const isStatic = symbol.startsWith('s-');
		const isEvent = symbol.startsWith('e-');
		const isMethod = props.type === 'method';

		const separator = isStatic ? '.' : '#';
		const name = isStatic
			? symbol.replace('s-', '')
			: isEvent
				? symbol.replace('e-', 'event:')
				: symbol;

		return `${file}${separator}${name}${isMethod ? '()' : ''}`;
	}

	if (regex) {
		const [, file, type, symbol] = regex;
		const brackets = type === 'Function' || props.type === 'method' ? '()' : '';
		if (!symbol) return `${file}${brackets}`;
		return `${file}#${symbol}${brackets}`;
	}

	return null;
});
</script>
