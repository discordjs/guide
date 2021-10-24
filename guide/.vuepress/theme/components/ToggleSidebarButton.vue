<template>
	<div class="toggle-sidebar-button" @click="$emit('toggle')">
		<MenuIcon class="icon sidebar-menu-icon" />
		<CloseIcon class="icon sidebar-close-icon" />
	</div>
</template>

<script setup lang="ts">
import MenuIcon from './icons/Bars.vue';
import CloseIcon from './icons/Close.vue';

defineEmits(['toggle']);
</script>
