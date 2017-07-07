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
			],
		},
	],
	disableSidebarToggle: true,
});
