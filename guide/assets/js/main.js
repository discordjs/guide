/* eslint-disable no-undef */

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
					title: 'Installing Node and discord.js',
					path: '/preparations/',
				},
				{
					title: 'Setting up a linter',
					path: '/preparations/setting-up-a-linter',
				},
				{
					title: 'Settings up a bot application',
					path: '/preparations/setting-up-a-bot-application',
				},
				{
					title: 'Adding your bot to servers',
					path: '/preparations/adding-your-bot-to-servers',
				},
			],
		},
		{
			title: 'Creating Your Bot',
			type: 'dropdown',
			items: [
				{
					title: 'Up & running',
					path: '/creating-your-bot/',
				},
				{
					title: 'Configuration files',
					path: '/creating-your-bot/configuration-files',
				},
				{
					title: 'Adding more commands',
					path: '/creating-your-bot/adding-more-commands',
				},
				{
					title: 'Commands with user input',
					path: '/creating-your-bot/commands-with-user-input',
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
					type: 'label',
					title: 'Database',
				},
				{
					title: 'Storing data with Sequelize',
					path: '/sequelize/',
				},
				{
					type: 'label',
					title: 'Sharding',
				},
				{
					title: 'Initial file',
					path: '/sharding/',
				},
				{
					title: 'Basic changes',
					path: '/sharding/basic-changes',
				},
				{
					title: 'Additional Information',
					path: '/sharding/additional',
				},
			],
		},
	],
	disableSidebarToggle: true,
});
