<template>
	<div class="sidebar-group" :class="{ 'sidebar-group-collapsed': !showSettings }">
		<button class="sidebar-heading sidebar-item" @click="showSettings = !showSettings">
			Settings
			<ChevronDown class="menu-icon" />
		</button>
		<ul v-show="showSettings">
			<li>
				<div class="sidebar-item">
					<ThemeOptions />
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ThemeOptions from './ThemeOptions.vue';
import ChevronDown from './icons/ChevronDown.vue';

const showSettings = ref(false);
</script>
