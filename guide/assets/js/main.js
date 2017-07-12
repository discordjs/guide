/* eslint-disable no-undef */
// trailing commas are only here during development mode; pls no hate

docute.init({
	nav: [
		{
			path: '/',
			title: 'Introduction',
		},
		{
			title: 'Installations & Preparations',
			type: 'dropdown',
			items: [
				{
					title: 'Installing Node and discord.js ',
					path: '/preparations/',
				},
				{
					title: 'Settings Up a Bot Application',
					path: '/preparations/setting-up-a-bot-application',
				},
				{
					title: 'Adding Your Bot to Servers',
					path: '/preparations/adding-your-bot-to-servers',
				},
				{
					title: 'Setting up a Code Editor',
					path: '/better-dev-environment/setting-up-a-linter',
				},
			],
		},
		{
			title: 'Creating Your Bot',
			type: 'dropdown',
			items: [
				{
					title: 'Up & Running',
					path: '/creating-your-bot/',
				},
				{
					title: 'Configuration Files',
					path: '/creating-your-bot/configuration-files',
				},
				{
					title: 'Adding More Commands',
					path: '/creating-your-bot/adding-more-commands',
				},
				{
					title: 'Common questions',
					path: '/creating-your-bot/common-questions',
				},
			],
		},
		{
			title: 'Extended features',
			type: 'dropdown',
			items: [
				{
					title: 'Storing data with sequelize',
					path: '/sequelize/',
				},
			],
		},
		{
			title: 'Sharding',
			type: 'dropdown',
			items: [
				{
					title: 'Initial file',
					path: '/sharding/',
				},
				{
					title: 'Basic changes',
					path: '/sharding/basic-changes',
				},
			],
		},
	],
	disableSidebarToggle: true,
});
