export default {
	'/commando/': [
		{
			isGroup: true,
			text: 'Home',
			children: [
				'/',
				'/requesting-more-content.md',
			],
		},
		{
			isGroup: true,
			text: 'Getting Started',
			children: [
				'/commando/',
				'/commando/first-command.md',
			],
		},
		{
			isGroup: true,
			text: 'Extra Command Info',
			children: [
				'/commando/throttling.md',
				'/commando/guild-only.md',
				'/commando/permissions.md',
			],
		},
		{
			isGroup: true,
			text: 'Arguments',
			children: [
				'/commando/args.md',
				'/commando/validators.md',
			],
		},
		{
			isGroup: true,
			text: 'Additional Information',
			children: [
				'/commando/client-values.md',
				'/commando/unknown-command-response.md',
			],
		},
	],
	'/': [
		{
			isGroup: true,
			text: 'Home',
			children: [
				'/',
				'/requesting-more-content.md',
			],
		},
		{
			isGroup: true,
			text: 'Installations & Preparations',
			children: [
				'/preparations/',
				'/preparations/setting-up-a-linter.md',
				'/preparations/setting-up-a-bot-application.md',
				'/preparations/adding-your-bot-to-servers.md',
			],
		},
		{
			isGroup: true,
			text: 'Creating Your Bot',
			children: [
				'/creating-your-bot/',
				'/creating-your-bot/configuration-files.md',
				'/creating-your-bot/adding-more-commands.md',
				'/creating-your-bot/commands-with-user-input.md',
			],
		},
		{
			isGroup: true,
			text: 'Command Handler',
			children: [
				'/command-handling/',
				'/command-handling/adding-features.md',
			],
		},
		{
			isGroup: true,
			text: 'Event Handler',
			children: [
				'/event-handling/',
			],
		},
		{
			isGroup: true,
			text: 'Popular Topics',
			children: [
				'/popular-topics/faq.md',
				'/popular-topics/embeds.md',
				'/popular-topics/errors.md',
				'/popular-topics/permissions.md',
				'/popular-topics/permissions-extended.md',
				'/popular-topics/reactions.md',
				'/popular-topics/collectors.md',
				'/popular-topics/partials.md',
				'/popular-topics/intents.md',
				'/popular-topics/canvas.md',
				'/popular-topics/webhooks.md',
				'/popular-topics/audit-logs.md',
			],
		},
		{
			isGroup: true,
			text: 'Miscellaneous',
			children: [
				'/miscellaneous/parsing-mention-arguments.md',
				'/miscellaneous/useful-packages.md',
			],
		},
		{
			isGroup: true,
			text: 'Databases',
			children: [
				'/sequelize/',
				'/sequelize/currency.md',
				'/keyv/',
			],
		},
		{
			isGroup: true,
			text: 'Sharding',
			children: [
				'/sharding/',
				'/sharding/additional-information.md',
				'/sharding/extended.md',
			],
		},
		{
			isGroup: true,
			text: 'OAuth2',
			children: [
				'/oauth2/',
			],
		},
		{
			isGroup: true,
			text: 'Voice',
			children: [
				'/voice/',
				'/voice/understanding-voice.md',
				'/voice/the-basics.md',
				'/voice/voice-broadcasts.md',
				'/voice/optimisation-and-troubleshooting.md',
				'/voice/receiving-audio.md',
			],
		},
		{
			isGroup: true,
			text: 'Improving Your Dev Environment',
			children: [
				'/improving-dev-environment/pm2.md',
				'/improving-dev-environment/package-json-scripts.md',
			],
		},
		{
			isGroup: true,
			text: 'Additional Information',
			children: [
				'/additional-info/notation.md',
				'/additional-info/es6-syntax.md',
				'/additional-info/collections.md',
				'/additional-info/async-await.md',
				'/additional-info/rest-api.md',
				'/additional-info/changes-in-v12.md',
			],
		},
	],
};
