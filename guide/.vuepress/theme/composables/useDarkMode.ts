import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';

export default function useDarkMode(): { isDarkMode: Ref<boolean> } {
	const isDarkMode = ref(false);

	const updateDarkModeClass = (value = isDarkMode.value): void => {
		// set `class="dark"` on `<html>` element
		const htmlEl = window?.document.querySelector('html');
		htmlEl?.classList.toggle('dark', value);

		const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

		if ((value && systemDarkMode) || (!value && !systemDarkMode)) {
			localStorage.removeItem('guide-color-scheme');
		} else if (value && !systemDarkMode) {
			localStorage.setItem('guide-color-scheme', 'dark');
		} else if (!value && systemDarkMode) {
			localStorage.setItem('guide-color-scheme', 'light');
		}
	}

	const mediaQuery = ref<MediaQueryList | null>(null)
	const onMediaQueryChange = (event: MediaQueryListEvent): void => {
		isDarkMode.value = event.matches;
	};

	onMounted(() => {
		// get stored preference and `prefers-color-scheme` media query and set the initial mode
		const userMode = localStorage.getItem('guide-color-scheme');
		mediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)');
		isDarkMode.value = userMode === 'dark' || (userMode !== 'light' && mediaQuery.value.matches);

		// watch changes
		mediaQuery.value.addEventListener('change', onMediaQueryChange);
		watch(isDarkMode, updateDarkModeClass, { immediate: true });
	});

	onUnmounted(() => {
		mediaQuery.value?.removeEventListener('change', onMediaQueryChange);
	});

	return {
		isDarkMode,
	};
}
