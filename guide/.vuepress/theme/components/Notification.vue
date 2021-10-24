<template>
	<div v-if="showNotification" class="notification">
		<div class="notification-content">
			<slot></slot>
		</div>
		<div class="notification-controls">
			<button class="notification-icon" @click.prevent="closeNotification"><CloseIcon /></button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CloseIcon from './icons/Close.vue';

const props = defineProps({
	storageKey: {
		type: String,
		required: true,
	},
});

const showNotification = ref(false);
const notificationKey = `guide-notification-${props.storageKey}`;

const closeNotification = () => {
	showNotification.value = false;
	localStorage.setItem(notificationKey, 'false');
};

onMounted(() => {
	if (localStorage.getItem(notificationKey) !== 'false') {
		showNotification.value = true;
	}
});
</script>

<style lang="scss">
.notification {
	color: var(--text-gray);
	background-color: var(--theme-600);
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0.75rem;
	border-radius: 0.5rem;
	box-sizing: border-box;

	.notification-content {
		display: inline-flex;
		align-items: center;
		line-height: 1.5rem;

		a {
			color: var(--theme-430);
		}

		.notification-icon {
			margin-right: 0.75rem;
		}
	}

	.notification-icon {
		color: var(--text-gray);
		background: var(--theme-530);
		display: inline-flex;
		padding: 0.5rem;
		border: 0;
		border-radius: 0.5rem;
		box-sizing: border-box;

		> svg {
			width: 1.5rem;
			height: 1.5rem;
		}
	}

	.notification-controls {
		margin-left: 0.75rem;

		.notification-icon {
			cursor: pointer;

			&:hover,
			&:focus {
				background-color: var(--theme-500);
			}
		}
	}
}
</style>
