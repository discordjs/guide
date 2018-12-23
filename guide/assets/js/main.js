/* eslint-disable no-undef */
Vue.use(VueDiscordMessage, {
	avatars: {
		djs: '/assets/img/discord-avatar-djs.png',
	},
});

Vue.component('tip', {
	template: '<p class="tip"><slot></slot></p>',
});

Vue.component('warning', {
	template: '<p class="warning"><slot></slot></p>',
});

Vue.component('danger', {
	template: '<p class="danger"><slot></slot></p>',
});
