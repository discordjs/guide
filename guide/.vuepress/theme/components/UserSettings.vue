<template>
	<div v-click-outside="hideMenu" class="user-settings">
		<a class="settings-button" href="#" @click.prevent="showMenu = !showMenu">
			<CogIcon class="settings-icon" />
		</a>
		<Transition name="menu-transition" mode="out-in">
			<div v-show="showMenu" class="user-settings-menu">
				<ThemeOptions />
			</div>
		</Transition>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { directive as ClickOutside } from 'click-outside-vue3';
import CogIcon from './CogIcon.vue';
import ThemeOptions from './ThemeOptions.vue';

export default defineComponent({
	directives: {
		ClickOutside,
	},
	components: {
		CogIcon,
		ThemeOptions,
	},
	setup() {
		const showMenu = ref(false);
		const hideMenu = () => showMenu.value = false;

		return {
			showMenu,
			hideMenu,
		};
	},
});
</script>

<style lang="scss">
:root {
	--settings-border-color: var(--theme-500);
}

html.guide-theme-blurple {
	--settings-border-color: var(--theme-500);
}

.user-settings {
	position: relative;
	margin-left: 2rem;

	@media screen and (max-width: 719px) {
		margin-left: 0;
	}

	.settings-button {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		.settings-icon {
			width: 18px;
		}
	}

	.user-settings-menu {
		background-color: var(--c-bg);
		position: absolute;
		top: 40px;
		left: 50%;
		min-width: 100px;
		margin: 0;
		padding: 1em;
		border: 1px solid var(--settings-border-color);
		border-radius: 4px;
		transform: translateX(-50%);
		z-index: 150;
		box-shadow: 0 0 4px 2px rgba(#000, 0.1);

		&::before {
			content: '';
			position: absolute;
			top: -7px;
			left: 50%;
			border-style: solid;
			border-color: transparent transparent var(--settings-border-color);
			border-width: 0 7px 7px;
			transform: translateX(-50%);
		}

		&.menu-transition-enter-active,
		&.menu-transition-leave-active {
			transition: all 0.25s ease-in-out;
		}

		&.menu-transition-enter-from,
		&.menu-transition-leave-to {
			top: 50px;
			opacity: 0;
		}

		ul {
			list-style-type: none;
			margin: 0;
			padding: 0;
		}
	}
}

@media (max-width: 719px) {
	.user-settings {
		margin-right: 0;

		.user-settings-menu {
			left: calc(50% - 35px);

			&::before {
				left: calc(50% + 35px);
			}
		}
	}
}
</style>
