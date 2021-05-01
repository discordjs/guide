import VueDiscordMessage from 'vue-discord-message';

export default ({ Vue }) => {
	Vue.use(VueDiscordMessage, {
		avatars: {
			djs: require('./assets/discord-avatar-djs.png'),
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
};
