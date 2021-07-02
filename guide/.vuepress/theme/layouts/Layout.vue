<template>
	<Layout>
		<template #navbar-after>
			<UserSettings />
		</template>
	</Layout>
</template>

<script setup>
import Layout from '@vuepress/theme-default/lib/client/layouts/Layout.vue';
import UserSettings from '../components/UserSettings.vue';
</script>
