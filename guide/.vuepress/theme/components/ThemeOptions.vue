<template>
	<div class="theme-options">
		<ul class="color-theme-options">
			<span>Theme:</span>
			<li>
				<a href="#" class="default-theme" @click.prevent="setTheme({ persist: true })">
					Green
				</a>
			</li>
			<li>
				<a href="#" class="blurple-theme" @click.prevent="setTheme({ colorTheme: 'blurple', persist: true })">Blurple</a>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';

const setTheme = ({ colorTheme = 'default', persist = false }) => {
	const themes = ['blurple'];
	const { classList } = document.documentElement;
	const themesClasses = themes.map(theme => `guide-theme-${theme}`);

	if (colorTheme !== 'default' && !themes.includes(colorTheme)) {
		const oldTheme = localStorage.getItem('guide-color-theme');
		colorTheme = themes.includes(oldTheme) ? oldTheme : 'default';
	}

	if (persist) {
		localStorage.setItem('guide-color-theme', colorTheme);
	}

	if (colorTheme === 'default') return classList.remove(...themesClasses);
	classList.remove(...themesClasses.filter(themeClass => themeClass !== `guide-theme-${colorTheme}`));
	classList.add(`guide-theme-${colorTheme}`);
};

onBeforeMount(() => {
	const userTheme = localStorage.getItem('guide-color-theme');
	setTheme({ colorTheme: userTheme });
});
</script>

<style lang="scss">
.theme-options {
	.color-theme-options {
		display: flex;
		justify-content: space-around;

		li {
			text-align: center;
			margin-left: 0.5rem;

			a {
				color: #fff;
				padding: 0.25rem 0.5rem;
				border-radius: 2px;

				&.default-theme {
					background-color: var(--green-500);

					&:hover {
						background-color: var(--green-530)
					}
				}

				&.blurple-theme {
					background-color: var(--blurple-500);

					&:hover {
						background-color: var(--blurple-530)
					}
				}
			}
		}
	}
}
</style>
