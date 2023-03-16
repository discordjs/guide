import { path } from '@vuepress/utils';
import { defaultTheme, DefaultThemeOptions, ThemeObject } from 'vuepress-vite';

export const discordJSTheme: (config: DefaultThemeOptions) => ThemeObject = defaultThemeOptions => ({
	name: 'vuepress-theme-discordjs-guide',
	'extends': defaultTheme(defaultThemeOptions),
	layouts: {
		Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
	},
});
