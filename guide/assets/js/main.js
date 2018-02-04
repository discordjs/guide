/* eslint-disable no-unused-vars, no-var */
if (localStorage.getItem('dark-theme') === 'true') {
	document.body.classList.add('dark');
}

var $docsify = {
	name: 'Discord.js Guide',
	repo: 'https://github.com/discordjs/Making-Bots-with-Discord.js',
	loadSidebar: true,
	subMaxLevel: 4,
	auto2top: true,
	ga: 'UA-108513187-1',
};
