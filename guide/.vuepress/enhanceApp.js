import VueDiscordMessage from '../../node_modules/vuepress-theme-yuu';

export default ({ Vue }) => {
	Vue.use(VueDiscordMessage, {
		avatars: {
			djs: require('../images/discord-avatar-djs.png'),
		},
	});
};
