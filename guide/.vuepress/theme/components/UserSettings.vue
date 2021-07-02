<template>
	<ul class="user-settings sidebar-links">
		<p class="sidebar-heading sidebar-item">Settings</p>
		<ul>
			<li>
				<div class="sidebar-item">
					<ThemeOptions />
				</div>
			</li>
		</ul>
	</ul>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import ThemeOptions from './ThemeOptions.vue';

const showMenu = ref(false);
const hideMenu = () => showMenu.value = false;
</script>

<style lang="scss">
.sidebar .user-settings.sidebar-links {
	padding: 1.25rem 0.5rem 0;
}
</style>
