const sidebar = require('./sidebar.js');

const config = {
	title: 'Discord.js Guide',
	description: 'A guide made by the community of discord.js for its users.',
	head: [
		['meta', { name: 'theme-color', content: '#42b983' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { name: 'og:title', content: 'Discord.js Guide' }],
		['meta', { name: 'og:description', content: 'A guide made by the community of discord.js for its users.' }],
		['meta', { name: 'og:type', content: 'website' }],
		['meta', { name: 'og:url', content: 'https://discordjs.guide/' }],
		['meta', { name: 'og:locale', content: 'en_US' }],
	],
	ga: 'UA-108513187-1',
	theme: 'yuu',
	themeConfig: {
		yuu: {
			colorThemes: ['blue', 'red'],
			extraOptions: { below: 'BranchSelector' },
		},
		algolia: {
			apiKey: 'c8d9361fb8403f7c5111887e0edf4b5e',
			indexName: 'discordjs',
		},
		repo: 'discordjs/guide',
		docsDir: 'guide',
		sidebarDepth: 3,
		editLinks: true,
		lastUpdated: true,
		nav: [
			{
				text: 'Home',
				link: '/',
			},
			{
				text: 'Updating',
				link: '/updating/',
			},
			{
				text: 'Commando',
				link: '/commando/',
			},
		],
		sidebar,
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@': '../',
			},
		},
	},
};

for (const group of Object.values(config.themeConfig.sidebar)) {
	for (const section of group) {
		if (section.collapsable) continue;
		section.collapsable = false;
	}
}

module.exports = config;
