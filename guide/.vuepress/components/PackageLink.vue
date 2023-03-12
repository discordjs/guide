<template>
	<a :href="link" target="_blank" rel="noopener noreferrer">
		<code>{{ linkText }}</code><OutboundLink />
	</a>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defaultDjsBranch } from '../constants';

const baseURL = `https://github.com/discordjs/discord.js/tree/${defaultDjsBranch}/packages`;

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
});

const link = computed(() => `${baseURL}/${props.name}`);
const linkText = computed(() => `@discordjs/${props.name}`);
</script>
