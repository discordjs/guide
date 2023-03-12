import { defineClientAppEnhance } from '@vuepress/client';
import {
	DiscordButton,
	DiscordButtons,
	DiscordEmbed,
	DiscordEmbedField,
	DiscordEmbedFields,
	DiscordInteraction,
	DiscordMarkdown,
	DiscordMention,
	DiscordMessage,
	DiscordMessages,
	DiscordReaction,
	DiscordReactions,
	install as DiscordMessageComponents,
} from '@discord-message-components/vue';
import DocsLink from './components/DocsLink.vue';
import PackageLink from './components/PackageLink.vue';
import ResultingCode from './components/ResultingCode.vue';
import djsAvatar from './assets/discord-avatar-djs.png';
import '@discord-message-components/vue/dist/style.css';

export default defineClientAppEnhance(({ app }) => {
	app.use(DiscordMessageComponents, {
		avatars: {
			djs: djsAvatar,
		},
		profiles: {
			user: {
				author: 'User',
				avatar: 'djs',
			},
			bot: {
				author: 'Guide Bot',
				avatar: 'green',
				bot: true,
			},
		},
	});

	app.component('DiscordButton', DiscordButton);
	app.component('DiscordButtons', DiscordButtons);
	app.component('DiscordEmbed', DiscordEmbed);
	app.component('DiscordEmbedField', DiscordEmbedField);
	app.component('DiscordEmbedFields', DiscordEmbedFields);
	app.component('DiscordInteraction', DiscordInteraction);
	app.component('DiscordMarkdown', DiscordMarkdown);
	app.component('DiscordMention', DiscordMention);
	app.component('DiscordMessage', DiscordMessage);
	app.component('DiscordMessages', DiscordMessages);
	app.component('DiscordReaction', DiscordReaction);
	app.component('DiscordReactions', DiscordReactions);

	app.component('DocsLink', DocsLink);
	app.component('PackageLink', PackageLink);
	app.component('ResultingCode', ResultingCode);
});
