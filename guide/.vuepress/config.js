const sidebar = require('./sidebar.js');

const config = {
	title: 'Discord.js Guide',
	description: 'A guide made by the community of discord.js for its users.',
	head: [
		['meta', { charset: 'utf-8' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'theme-color', content: '#42b983' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { property: 'og:title', content: 'Discord.js Guide' }],
		['meta', { property: 'og:description', content: 'A guide made by the community of discord.js for its users.' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:url', content: 'https://discordjs.guide/' }],
		['meta', { property: 'og:locale', content: 'en_US' }],
		['meta', { property: 'og:image', content: '/meta-image.png' }],
	],
	plugins: [],
	theme: 'yuu',
	themeConfig: {
		yuu: {
			logo: 'GuideLogo',
			extraOptions: { before: 'BranchSelector' },
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
				text: 'Commando',
				link: '/commando/',
			},
			{
				text: 'Discord.js Documentation',
				link: 'https://discord.js.org/#/docs/main/stable/general/welcome',
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
	globalUIComponents: ['EOLNotice'],
};

for (const group of Object.values(config.themeConfig.sidebar)) {
	for (const section of group) {
		if (section.collapsable) continue;
		section.collapsable = false;
	}
}

module.exports = config;
