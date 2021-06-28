import path from 'path'
import { defineUserConfig } from 'vuepress-vite'
import type { DefaultThemeOptions, ViteBundlerOptions } from 'vuepress-vite'
import sidebar from './sidebar'

const config = defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
	bundler: '@vuepress/vite',
	lang: 'en-US',
	title: 'Discord.js Guide',
	description: 'Imagine a guide... that explores the many possibilies for your discord.js bot.',
	head: [
		['meta', { charset: 'utf-8' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'theme-color', content: '#5865f2' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { property: 'og:title', content: 'Discord.js Guide' }],
		['meta', { property: 'og:description', content: 'Imagine a guide... that explores the many possibilies for your discord.js bot.' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'https://discordjs.guide/' }],
		['meta', { property: 'og:locale', content: 'en_US' }],
		['meta', { property: 'og:image', content: '/meta-image.png' }],
	],
	themeConfig: {
		contributors: false,
		sidebar,
		repo: 'discordjs/guide',
		docsDir: 'guide',
		sidebarDepth: 3,
		editLinks: true,
		lastUpdated: true,
		navbar: [
			{
				text: 'Commando',
				link: '/commando/',
			},
			{
				text: 'Documentation',
				link: 'https://discord.js.org/#/docs/main/stable/general/welcome',
			},
		],
	},
	plugins: [],
})

if (process.env.NODE_ENV === 'production') {
	config.plugins.push(
		[
			'@vuepress/plugin-docsearch',
			{
				apiKey: 'c8d9361fb8403f7c5111887e0edf4b5e',
				indexName: 'discordjs',
			},
		],
	);
}

export default config;
