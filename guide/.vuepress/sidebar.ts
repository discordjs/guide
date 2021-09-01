export default {
	'/voice/': [
		{
			text: 'Home',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: 'Getting Started',
			children: [
				'/voice/',
			],
		},
		{
			text: 'Library',
			children: [
				'/voice/life-cycles.md',
				'/voice/voice-connections.md',
				'/voice/audio-player.md',
				'/voice/audio-resources.md',
			],
		},
	],
	'/': [
		{
			text: 'Home',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: '설치 밑 준비',
			children: [
				'/preparations/',
				'/preparations/setting-up-a-linter.md',
				'/preparations/setting-up-a-bot-application.md',
				'/preparations/adding-your-bot-to-servers.md',
			],
		},
		{
			text: '봇 만들기',
			children: [
				'/creating-your-bot/',
				'/creating-your-bot/creating-commands.md',
				'/creating-your-bot/command-handling/',
				'/creating-your-bot/event-handling/',
			],
		},
		{
			text: 'Interactions',
			children: [
				'/interactions/registering-slash-commands.md',
				'/interactions/replying-to-slash-commands.md',
				'/interactions/slash-command-permissions.md',
				'/interactions/buttons.md',
				'/interactions/select-menus.md',
			],
		},
		{
			text: 'Popular Topics',
			children: [
				'/popular-topics/faq.md',
				'/popular-topics/threads.md',
				'/popular-topics/embeds.md',
				'/popular-topics/builders.md',
				'/popular-topics/reactions.md',
				'/popular-topics/collectors.md',
				'/popular-topics/permissions.md',
				'/popular-topics/permissions-extended.md',
				'/popular-topics/intents.md',
				'/popular-topics/partials.md',
				'/popular-topics/webhooks.md',
				'/popular-topics/errors.md',
				'/popular-topics/audit-logs.md',
				'/popular-topics/canvas.md',
			],
		},
		{
			text: 'Miscellaneous',
			children: [
				'/miscellaneous/parsing-mention-arguments.md',
				'/miscellaneous/useful-packages.md',
			],
		},
		{
			text: 'Databases',
			children: [
				'/sequelize/',
				'/sequelize/currency.md',
				'/keyv/',
			],
		},
		{
			text: 'Sharding',
			children: [
				'/sharding/',
				'/sharding/additional-information.md',
				'/sharding/extended.md',
			],
		},
		{
			text: 'OAuth2',
			children: [
				'/oauth2/',
			],
		},
		{
			text: 'Improving Your Dev Environment',
			children: [
				'/improving-dev-environment/pm2.md',
				'/improving-dev-environment/package-json-scripts.md',
			],
		},
		{
			text: 'Additional Information',
			children: [
				'/additional-info/notation.md',
				'/additional-info/es6-syntax.md',
				'/additional-info/collections.md',
				'/additional-info/async-await.md',
				'/additional-info/rest-api.md',
				'/additional-info/changes-in-v13.md',
			],
		},
	],
};
