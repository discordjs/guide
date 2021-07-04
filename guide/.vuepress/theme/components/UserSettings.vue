<template>
	<ul class="user-settings sidebar-links" :class="{ 'user-settings-open': showSettings }">
		<button class="sidebar-heading sidebar-item" @click="showSettings = !showSettings">
			Settings
			<ChevronRight class="menu-icon" />
		</button>
		<ul v-if="showSettings">
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
import ChevronRight from './icons/ChevronRight.vue';

const showSettings = ref(false);
</script>

<style lang="scss">
.sidebar .user-settings.sidebar-links {
	padding: 1.25rem 0.5rem 0;

	button.sidebar-heading {
		background: none;
		display: inline-flex;
		align-items: center;
		border: none;
		cursor: pointer;

		.menu-icon {
			width: 1.5em;
			height: 1.5em;
		}
	}

	&.user-settings-open {
		.sidebar-heading .menu-icon {
			transform: rotate(90deg);
		}
	}
}
</style>
