import VueDiscordMessage from 'vue-discord-message';

export default ({ Vue }) => {
	Vue.use(VueDiscordMessage, {
		avatars: {
			djs: require('../images/discord-avatar-djs.png'),
		},
		profiles: {
			user: {
				author: 'User',
				avatar: 'djs',
			},
			bot: {
				author: 'Tutorial Bot',
				avatar: 'blue',
				bot: true,
			},
		},
	});
};
