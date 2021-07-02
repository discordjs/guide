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
.user-settings.sidebar-links {
	padding: 1.25rem 0.5rem 0;

	.settings-button {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		.settings-icon {
			width: 18px;
		}
	}
}
</style>
