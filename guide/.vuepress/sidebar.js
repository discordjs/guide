module.exports = {
	'/commando/': [
		{
			title: 'Home',
			children: [
				'/',
				'/requesting-more-content'
			],
		},
		{
			title: 'Getting Started',
			children: [
				'/commando/',
				'/commando/first-command',
			],
		},
		{
			title: 'Extra Command Info',
			children: [
				'/commando/throttling',
				'/commando/guild-only',
				'/commando/permissions',
			],
		},
		{
			title: 'Arguments',
			children: [
				'/commando/args',
				'/commando/validators',
			],
		},
		{
			title: 'Additional Information',
			children: [
				'/commando/client-values',
				'/commando/unknown-command-response',
			],
		},
	],
	'/': [
		{
			title: 'Home',
			children: [
				'/',
				'requesting-more-content'
			],
		},
		{
			title: 'Installations & Preparations',
			children: [
				['/preparations/', 'Installing Node and discord.js'],
				['/preparations/setting-up-a-linter', 'Setting up a linter'],
				['/preparations/setting-up-a-bot-application', 'Setting up a bot application'],
				['/preparations/adding-your-bot-to-servers', 'Adding your bot to servers'],
			],
		},
		{
			title: 'Creating Your Bot',
			children: [
				'/creating-your-bot/',
				'/creating-your-bot/configuration-files',
				'/creating-your-bot/adding-more-commands',
				['/creating-your-bot/commands-with-user-input', 'Commands with user input'],
			],
		},
		{
			title: 'Command Handler',
			children: [
				'/command-handling/',
				['/command-handling/dynamic-commands', 'Dynamic commands setup'],
				'/command-handling/adding-features',
			],
		},
		{
			title: 'Popular Topics',
			children: [
				['/popular-topics/embeds', 'Embeds'],
				['/popular-topics/permissions', 'Permissions'],
				['/popular-topics/permissions-extended', 'Permissions (extended)'],
				['/popular-topics/reactions', 'Reactions'],
				['/popular-topics/collectors', 'Collectors'],
				['/popular-topics/canvas', 'Image manipulation with Canvas'],
				'/popular-topics/common-questions',
				'/popular-topics/miscellaneous-examples',
			],
		},
		{
			title: 'Miscellaneous',
			children: [
				'/miscellaneous/parsing-mention-arguments',
				'/miscellaneous/useful-packages',
			],
		},
		{
			title: 'Databases',
			children: [
				'/sequelize/',
				['/sequelize/currency', 'Making a currency system'],
				'/keyv/',
			],
		},
		{
			title: 'Sharding',
			children: [
				['/sharding/', 'Getting started'],
				['/sharding/additional-information', 'Additional information'],
				'/sharding/extended',
			],
		},
		{
			title: 'OAuth2',
			children: [
				['/oauth2/', 'Getting an access token'],
			],
		},
		{
			title: 'Improving Your Dev Environment',
			children: [
				'/improving-dev-environment/pm2',
				'/improving-dev-environment/package-json-scripts',
			],
		},
		{
			title: 'Additional Information',
			children: [
				'/additional-info/notation',
				['/additional-info/es6-syntax', 'ES6 syntax examples'],
				'/additional-info/collections',
				'/additional-info/async-await',
				'/additional-info/rest-api',
			],
		},
	],
}
