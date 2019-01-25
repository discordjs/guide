const sidebar = require('./sidebar.js');

const config = {
	title: 'Discord.js ガイド',
	description: 'discord.jsのコミュニティによって作られたユーザーガイドを日本語に翻訳したサイト',
	head: [
		['meta', { name: 'theme-color', content: '#42b983' }],
		['meta', { name: 'twitter:card', content: 'summary' }],
		['meta', { name: 'og:title', content: 'Discord.js ガイド' }],
		['meta', { name: 'og:description', content: 'discord.jsのコミュニティによって作られたユーザーガイドを日本語に翻訳したサイト' }],
		['meta', { name: 'og:type', content: 'website' }],
		['meta', { name: 'og:url', content: 'https://guide.djs-jpn.tk/' }],
		['meta', { name: 'og:locale', content: 'ja_JP' }],
	],
	ga: 'UA-133246433-1',
	theme: 'yuu',
	themeConfig: {
		yuu: {
			colorThemes: ['blue', 'red'],
		},
		repo: 'DJS-JPN/guide',
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
