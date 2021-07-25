export default function useColorTheme() {
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

	return {
		setTheme,
	};
}
